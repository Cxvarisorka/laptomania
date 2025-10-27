const Laptop = require("../models/laptop.model");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");


// Add a new laptop
const addLaptop = catchAsync(async (req, res) => {
    const body = req.body;
    body.images = req.files.map(file => file.path);
    const newLaptop = await Laptop.create(body);

    res.status(201).json(newLaptop);
});

// Get all laptops
const getLaptops = catchAsync(async (req, res) => {
    const laptops = await Laptop.find();
    res.status(200).json(laptops);
});

// Get laptop by ID
const getLaptop = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const laptop = await Laptop.findById(id);

    if (!laptop) {
        return next(new AppError('Laptop not found', 404));
    }

    res.status(200).json(laptop);
});

// Delete laptop by ID
const deleteLaptop = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const laptop = await Laptop.findByIdAndDelete(id);

    if (!laptop) {
        return next(new AppError('Laptop not found to delete', 404));
    }

    res.status(204).json();
});

module.exports = { addLaptop, getLaptops, getLaptop, deleteLaptop };