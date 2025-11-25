# Security Audit Report - Laptomania Server

**Date:** November 21, 2025
**Auditor:** Professional Cybersecurity Assessment
**Application:** Laptomania E-commerce Backend
**Framework:** Node.js + Express + MongoDB

---

## Executive Summary

This security audit identified **22 security vulnerabilities** ranging from CRITICAL to LOW severity. The most critical issues include exposed credentials in version control, weak authentication mechanisms, and insufficient input validation. Immediate action is required to address CRITICAL and HIGH severity issues before production deployment.

**Risk Distribution:**
- CRITICAL: 3 issues
- HIGH: 8 issues
- MEDIUM: 7 issues
- LOW: 4 issues

---

## CRITICAL Severity Issues

### 1. Sensitive Credentials Exposed in Repository

**Location:** `server/.env:1-21`
**CVSS Score:** 9.8 (Critical)

**Issue:**
The `.env` file containing sensitive credentials is tracked in the repository with the following exposed secrets:
- MongoDB connection string with credentials
- JWT secret key
- Cloudinary API keys and secrets
- Email service credentials

**Impact:**
- Complete database compromise
- Account takeover via JWT forgery
- Unauthorized access to cloud storage
- Email system abuse

**Recommendation:**
1. **IMMEDIATE:** Remove `.env` from git history using:
   ```bash
   git filter-branch --force --index-filter "git rm --cached --ignore-unmatch server/.env" --prune-empty --tag-name-filter cat -- --all
   ```
2. Rotate ALL exposed credentials immediately:
   - Generate new MongoDB credentials
   - Create new JWT secret (minimum 256 bits)
   - Rotate Cloudinary API keys
   - Update email service credentials
3. Verify `.gitignore` includes `.env`
4. Consider using a secrets management service (AWS Secrets Manager, HashiCorp Vault)
5. Add pre-commit hooks to prevent future secrets commits

---

### 2. No Email Verification Required for Login

**Location:** `server/controllers/auth.controller.js:357-373`
**CVSS Score:** 8.1 (High/Critical)

**Issue:**
The login function does not check if a user has verified their email before allowing authentication:

```javascript
const login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email}).select('+password');

    if(!user) {
        return next(new AppError('Invalid email or password', 401));
    }

    // MISSING: Check for user.isVerified
    const isPasswordValid = await user.comparePassword(password);
    // ...
});
```

**Impact:**
- Attackers can create accounts with fake emails and use the system
- Account enumeration attacks
- Spam and abuse potential
- Compromised data integrity

**Recommendation:**
Add verification check after password validation:
```javascript
if(!user.isVerified) {
    return next(new AppError('Please verify your email before logging in', 403));
}
```

---

### 3. Email Verification Tokens Never Expire

**Location:** `server/models/user.model.js:53-57`, `server/controllers/auth.controller.js:340-355`
**CVSS Score:** 7.5 (High)

**Issue:**
Verification codes are generated but never expire:

```javascript
userSchema.methods.createEmailVerificationToken = function() {
    const code = crypto.randomBytes(12).toString('hex');
    this.verificationCode = code;
    // MISSING: Set expiration time
    return code;
}
```

The schema defines `emailVerificationExpires` but it's never set or checked.

**Impact:**
- Old verification links remain valid indefinitely
- Increased attack window for intercepted emails
- Account takeover if verification emails are compromised later

**Recommendation:**
1. Set expiration when creating token:
   ```javascript
   this.verificationCode = code;
   this.verificationCodeExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
   ```
2. Check expiration in verify function:
   ```javascript
   if(!user || user.verificationCodeExpires < Date.now()) {
       return next(new AppError('Invalid or expired verification code', 400));
   }
   ```

---

## HIGH Severity Issues

### 4. Insufficient File Upload Validation

**Location:** `server/config/multer.js:1-11`, `server/routers/laptop.router.js:11,17`
**CVSS Score:** 7.8 (High)

**Issue:**
Multer configuration lacks critical security controls:
- No file type/MIME type validation
- No file size limits
- No filename sanitization beyond timestamp
- Allows arbitrary file uploads

**Impact:**
- Malicious file uploads (malware, web shells)
- Path traversal attacks
- Denial of Service via large files
- XSS via SVG files
- Server compromise

**Recommendation:**
Implement comprehensive file upload validation:

```javascript
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        // Sanitize filename
        const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, Date.now() + '-' + sanitized);
    }
});

const fileFilter = (req, file, cb) => {
    // Allow only specific image types
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, PNG, WEBP) are allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 4
    }
});
```

---

### 5. NoSQL Injection Vulnerabilities

**Location:** Multiple files - all database queries
**CVSS Score:** 7.5 (High)

**Issue:**
No input sanitization for MongoDB queries. User input is directly used in database operations:

```javascript
const user = await User.findOne({email}).select('+password');
const laptop = await Laptop.findById(id);
```

**Impact:**
- Authentication bypass
- Unauthorized data access
- Data manipulation
- Account enumeration

**Example Attack:**
```json
POST /api/auth/login
{
    "email": {"$ne": null},
    "password": {"$ne": null}
}
```

**Recommendation:**
1. Install and configure express-mongo-sanitize:
   ```bash
   npm install express-mongo-sanitize
   ```
2. Add to `app.js`:
   ```javascript
   const mongoSanitize = require('express-mongo-sanitize');
   app.use(mongoSanitize());
   ```

---

### 6. Weak Password Policy

**Location:** `server/models/user.model.js:20-26`
**CVSS Score:** 7.0 (High)

**Issue:**
Password constraints are inadequate:
```javascript
password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    maxLength: 12,  // Too restrictive!
    select: false
}
```

**Problems:**
- Maximum 12 characters prevents strong passwords
- No complexity requirements (uppercase, numbers, symbols)
- Minimum 6 characters is too weak

**Impact:**
- Vulnerable to brute force attacks
- Dictionary attacks succeed easily
- Weak account security

**Recommendation:**
1. Remove `maxLength` or set to 128 characters
2. Implement password complexity validation:
   ```javascript
   const passwordValidator = require('validator');

   userSchema.pre('save', function(next) {
       if (this.isModified('password')) {
           const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
           if (!strongRegex.test(this.password)) {
               return next(new Error('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'));
           }
       }
       next();
   });
   ```

---

### 7. Missing Security Headers

**Location:** `server/app.js` (missing)
**CVSS Score:** 6.5 (Medium-High)

**Issue:**
No security headers are configured, leaving the application vulnerable to common attacks:
- No XSS protection
- No clickjacking protection
- No content type sniffing prevention
- No HTTPS enforcement
- No Content Security Policy

**Impact:**
- Cross-Site Scripting (XSS) attacks
- Clickjacking attacks
- MIME sniffing attacks
- Man-in-the-middle attacks

**Recommendation:**
Install and configure Helmet:
```bash
npm install helmet
```

Add to `app.js`:
```javascript
const helmet = require('helmet');

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));
```

---

### 8. No Rate Limiting on Authentication Endpoints

**Location:** `server/app.js:17-20`, `server/routers/auth.router.js`
**CVSS Score:** 6.5 (Medium-High)

**Issue:**
Rate limiting is applied globally at 100 requests per 15 minutes, but authentication endpoints need stricter limits:

```javascript
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100  // Too permissive for login/signup
}));
```

**Impact:**
- Credential stuffing attacks
- Brute force password attacks
- Account enumeration
- Resource exhaustion

**Recommendation:**
Implement endpoint-specific rate limiting:

```javascript
const authLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5, // 5 attempts per 15 minutes
    message: 'Too many authentication attempts, please try again later'
});

const signupLimiter = rateLimiter({
    windowMs: 60 * 60 * 1000,
    max: 3, // 3 signups per hour
    message: 'Too many accounts created, please try again later'
});

authRouter.post('/login', authLimiter, login);
authRouter.post('/signup', signupLimiter, signup);
```

---

### 9. Missing CSRF Protection

**Location:** All POST/PUT/PATCH/DELETE endpoints
**CVSS Score:** 6.5 (Medium-High)

**Issue:**
No CSRF token validation for state-changing operations. Since cookies are used for authentication with `credentials: true`, the application is vulnerable to CSRF attacks.

**Impact:**
- Attackers can perform actions on behalf of authenticated users
- Unauthorized laptop additions/deletions
- Account modifications
- Forced logouts

**Recommendation:**
Implement CSRF protection:
```bash
npm install csurf
```

```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.use(csrfProtection);

// Send CSRF token to client
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});
```

---

### 10. Verification URL Uses Untrusted Host Header

**Location:** `server/controllers/auth.controller.js:30`
**CVSS Score:** 6.0 (Medium)

**Issue:**
Verification URL construction uses `req.get("host")` which can be manipulated:

```javascript
const verificationUrl = `${req.protocol}://${req.get("host")}/api/auth/verify/${code}`;
```

**Impact:**
- Host header injection attacks
- Password reset poisoning
- Phishing via manipulated verification links
- Open redirect vulnerabilities

**Recommendation:**
Use a configured frontend URL:
```javascript
const verificationUrl = `${process.env.FRONTEND_URL}/verify/${code}`;
```

---

### 11. No Account Lockout Mechanism

**Location:** `server/controllers/auth.controller.js:357-373`
**CVSS Score:** 6.0 (Medium)

**Issue:**
No protection against unlimited failed login attempts.

**Impact:**
- Brute force attacks
- Credential stuffing
- Account enumeration
- Resource exhaustion

**Recommendation:**
Implement account lockout:

```javascript
// Add to user model
failedLoginAttempts: { type: Number, default: 0 },
lockUntil: { type: Date }

// Add to login logic
if (user.lockUntil && user.lockUntil > Date.now()) {
    return next(new AppError('Account locked. Try again later', 423));
}

if (!isPasswordValid) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes
    }
    await user.save();
    return next(new AppError('Invalid email or password', 401));
}

// Reset on successful login
user.failedLoginAttempts = 0;
user.lockUntil = undefined;
```

---

## MEDIUM Severity Issues

### 12. JWT Token Cannot Be Revoked

**Location:** `server/middlewares/auth.middleware.js:14`
**CVSS Score:** 5.5 (Medium)

**Issue:**
JWT tokens remain valid until expiration with no revocation mechanism. If a user logs out or changes password, old tokens still work.

**Impact:**
- Stolen tokens remain valid
- No way to force logout
- Compromised accounts cannot be secured immediately

**Recommendation:**
Implement token blacklist or use Redis for session management:
```javascript
// Option 1: Add token version to user model
tokenVersion: { type: Number, default: 0 }

// Increment on logout/password change
user.tokenVersion += 1;

// Check in protect middleware
if (decoded.tokenVersion !== user.tokenVersion) {
    return next(new AppError('Token is no longer valid', 401));
}
```

---

### 13. Insufficient Input Validation

**Location:** `server/controllers/auth.controller.js:23-25`, `server/controllers/laptop.controller.js:11-12`
**CVSS Score:** 5.5 (Medium)

**Issue:**
Minimal validation on user input:
```javascript
const {email, fullname, password} = req.body;
const newUser = await User.create({email, fullname, password});

const body = req.body;  // No validation!
const newLaptop = await Laptop.create(body);
```

**Impact:**
- Mass assignment vulnerabilities
- Unexpected fields in database
- Data integrity issues
- Business logic bypass

**Recommendation:**
Use express-validator or Joi:
```bash
npm install express-validator
```

```javascript
const { body, validationResult } = require('express-validator');

const signupValidation = [
    body('email').isEmail().normalizeEmail(),
    body('fullname').trim().isLength({ min: 2, max: 50 }).escape(),
    body('password').isLength({ min: 8, max: 128 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

authRouter.post('/signup', signupValidation, signup);
```

---

### 14. Information Disclosure in Error Messages

**Location:** `server/controllers/error.controller.js:1-8`
**CVSS Score:** 5.3 (Medium)

**Issue:**
Development error handler exposes sensitive information:
```javascript
const sendErrorDev = (err, res) => {
    return res.status(err.statusCode || 500).json({
        status: err.status,
        message: err.message,
        stack: err.stack,  // Stack trace exposed!
        err
    });
}
```

**Impact:**
- System architecture disclosure
- File path leakage
- Technology stack exposure
- Aids in targeted attacks

**Recommendation:**
Ensure development mode is never used in production:
```javascript
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Add strict environment check
    if(process.env.NODE_ENV === 'production') {
        sendErrorProd(err, res);
    } else if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        // Default to production mode if NODE_ENV not set
        sendErrorProd(err, res);
    }
};
```

---

### 15. Logic Error in Delete Function

**Location:** `server/controllers/laptop.controller.js:49-63`
**CVSS Score:** 5.0 (Medium)

**Issue:**
Checks if laptop exists AFTER deletion:
```javascript
const deleteLaptop = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const laptop = await Laptop.findByIdAndDelete(id);

    const promises = laptop.images.map(img => deleteImage(img.public_id));
    await Promise.all(promises);

    if (!laptop) {  // This check is AFTER deletion!
        return next(new AppError('Laptop not found to delete', 404));
    }

    res.status(204).json();
});
```

**Impact:**
- Improper error handling
- Potential null pointer errors
- Inconsistent API responses

**Recommendation:**
```javascript
const deleteLaptop = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const laptop = await Laptop.findById(id);

    if (!laptop) {
        return next(new AppError('Laptop not found to delete', 404));
    }

    const promises = laptop.images.map(img => deleteImage(img.public_id));
    await Promise.all(promises);

    await Laptop.findByIdAndDelete(id);

    res.status(204).json();
});
```

---

### 16. Auto-Login Exposes Sensitive Data

**Location:** `server/routers/auth.router.js:15-17`
**CVSS Score:** 5.0 (Medium)

**Issue:**
Returns entire user object:
```javascript
authRouter.post('/auto-login', protect, async (req, res, next) => {
    res.status(200).json(req.user);
});
```

**Impact:**
- Potential exposure of internal fields
- Unnecessary data transmission
- Privacy concerns

**Recommendation:**
```javascript
authRouter.post('/auto-login', protect, async (req, res, next) => {
    const { _id, fullname, email, role, isVerified, isActive } = req.user;
    res.status(200).json({ _id, fullname, email, role, isVerified, isActive });
});
```

---

### 17. No Request Body Size Limit

**Location:** `server/app.js:34`
**CVSS Score:** 5.0 (Medium)

**Issue:**
JSON body parser has no size limit:
```javascript
app.use(express.json());
```

**Impact:**
- Denial of Service attacks
- Memory exhaustion
- Server crashes

**Recommendation:**
```javascript
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
```

---

### 18. MongoDB Connection Missing Error Handling

**Location:** `server/app.js:48-55`
**CVSS Score:** 4.5 (Medium)

**Issue:**
No error handling for connection failures or disconnections:
```javascript
mongoose.connect(process.env.DB)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    });
    // MISSING: .catch() handler
```

**Impact:**
- Unhandled promise rejections
- Server crashes
- No reconnection logic

**Recommendation:**
```javascript
mongoose.connect(process.env.DB)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', err => {
    console.error('MongoDB error:', err);
});
```

---

## LOW Severity Issues

### 19. Incorrect HTTP Status Code

**Location:** `server/middlewares/roles.middleware.js:9`
**CVSS Score:** 3.0 (Low)

**Issue:**
Returns 401 (Unauthorized) instead of 403 (Forbidden) for authorization failures:
```javascript
if(!roles.includes(req.user.role)){
    return next(new AppError("You dont have permission!", 401))  // Should be 403
}
```

**Recommendation:**
```javascript
return next(new AppError("You don't have permission to perform this action", 403))
```

---

### 20. Console.log in Production Code

**Location:** `server/controllers/laptop.controller.js:56,70`
**CVSS Score:** 2.5 (Low)

**Issue:**
Debug statements left in production code:
```javascript
console.log(result);
console.log(req.file, req.files)
```

**Impact:**
- Performance overhead
- Log pollution
- Potential information disclosure

**Recommendation:**
Replace with proper logging library:
```bash
npm install winston
```

```javascript
const logger = require('./utils/logger');
logger.info('Images deleted', { result });
```

---

### 21. Missing Password Reset Functionality

**Location:** N/A (Feature missing)
**CVSS Score:** N/A (Functionality gap)

**Issue:**
No password reset/forgot password functionality.

**Impact:**
- Users locked out of accounts permanently
- Poor user experience
- Increased support burden

**Recommendation:**
Implement password reset flow:
1. Generate secure reset token
2. Send email with reset link
3. Verify token and allow password change
4. Invalidate all existing sessions

---

### 22. No Security Logging & Monitoring

**Location:** Application-wide
**CVSS Score:** N/A (Security gap)

**Issue:**
No logging of security events:
- Failed login attempts
- Account changes
- Administrative actions
- Suspicious activities

**Impact:**
- No audit trail
- Cannot detect breaches
- Difficult incident response
- Compliance violations

**Recommendation:**
Implement comprehensive logging:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'security.log', level: 'warn' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// Log security events
logger.warn('Failed login attempt', { email, ip: req.ip, timestamp: new Date() });
logger.info('User logged in', { userId: user._id, ip: req.ip });
```

---

## Additional Recommendations

### 1. Dependency Security Audit
Run regular security audits on dependencies:
```bash
npm audit
npm audit fix
```

Consider using `npm-check-updates` to keep dependencies current.

### 2. Environment Configuration
Create separate environment files:
- `.env.development`
- `.env.staging`
- `.env.production`

Use `dotenv-safe` to validate required environment variables.

### 3. API Documentation Security
If using API documentation (Swagger/OpenAPI):
- Disable in production or require authentication
- Don't expose sensitive endpoints
- Sanitize example data

### 4. Database Security
- Enable MongoDB authentication
- Use principle of least privilege for database user
- Enable MongoDB audit logging
- Implement database backups
- Use connection pooling

### 5. HTTPS Configuration
- Enforce HTTPS in production
- Use HSTS headers (already recommended in Helmet)
- Configure proper TLS/SSL certificates
- Disable insecure protocols (TLS 1.0, 1.1)

### 6. Session Management
Consider migrating from JWT in cookies to session-based auth with Redis for better control:
```bash
npm install express-session connect-redis ioredis
```

### 7. API Versioning
Implement API versioning for better security update management:
```javascript
app.use('/api/v1/laptops', laptopRouter);
app.use('/api/v1/auth', authRouter);
```

### 8. Security Testing
- Implement automated security testing in CI/CD
- Use tools like OWASP ZAP, Burp Suite
- Conduct penetration testing before production
- Set up bug bounty program

---

## Priority Action Plan

### Immediate (Within 24 hours)
1. Remove and rotate all exposed credentials in `.env`
2. Implement email verification check on login
3. Add verification token expiration
4. Install and configure Helmet
5. Install express-mongo-sanitize

### Short-term (Within 1 week)
1. Implement file upload validation
2. Add stricter rate limiting on auth endpoints
3. Fix password policy
4. Implement account lockout
5. Add input validation throughout application
6. Fix delete laptop logic error

### Medium-term (Within 1 month)
1. Implement CSRF protection
2. Add token revocation mechanism
3. Implement password reset functionality
4. Set up security logging and monitoring
5. Add proper error handling for MongoDB
6. Conduct full penetration test

### Long-term (Ongoing)
1. Regular dependency audits
2. Security training for development team
3. Code review process with security focus
4. Implement automated security scanning in CI/CD
5. Regular security assessments

---

## Compliance Considerations

If handling user data, ensure compliance with:
- **GDPR** (EU users): Right to deletion, data portability, consent
- **CCPA** (California users): Privacy notices, opt-out rights
- **PCI DSS** (if handling payments): Never store credit card data
- **SOC 2**: Implement security controls and logging

---

## Conclusion

The Laptomania server application has a solid foundation but requires immediate security improvements before production deployment. The most critical issues involve exposed credentials and authentication vulnerabilities that could lead to complete system compromise.

By following this report and implementing the recommended fixes, the application's security posture will significantly improve, protecting both user data and business operations.

**Next Steps:**
1. Review this report with the development team
2. Prioritize fixes based on severity and impact
3. Create tickets/issues for each vulnerability
4. Implement fixes systematically
5. Conduct security retesting after remediation
6. Establish ongoing security practices

---

**Report End**

For questions or clarification on any findings, please review the specific file locations and line numbers referenced throughout this document.
