const Service = require("../../../models/service");
const service = require("../../../models/service");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createService = catchAsync(async (req, res, next) => {

    let { name } = req.body

    if (!name || !name.trim()) return new AppError(`name is required.`, 400);

    let service = new Service({ name });
    await service.save()

    return res.status(201).json({
        status: true,
        message: "Service added successfully.",
        data: { service },
        newService: true,
    });
})