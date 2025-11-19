const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
// const path = require('path');

// Routers
const laptopRouter = require('./routers/laptop.router');
const globalErrorHandler = require('./controllers/error.controller');
const authRouter = require('./routers/auth.router');

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// app.use('/laptops/images', express.static(path.join(__dirname, 'uploads/laptops')));

// Using routers
app.use('/api/laptops', laptopRouter);
app.use('/api/auth', authRouter)

// Global Error Handling
app.use(globalErrorHandler); 

// Connect to MongoDB and start the server
mongoose.connect(process.env.DB)
    .then(() => {
        console.log('Connected to MongoDB');

        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    });

