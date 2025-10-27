const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Routers
const laptopRouter = require('./routers/laptop.router');
const globalErrorHandler = require('./controllers/error.controller');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());



// Using routers
app.use('/api/laptops', laptopRouter);

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

