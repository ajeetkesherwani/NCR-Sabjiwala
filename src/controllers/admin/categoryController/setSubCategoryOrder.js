const mongoose = require("mongoose");
const Category = require("../../../models/category");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.setSubCategoryOrder = catchAsync(async (req, res, next) => {
    const updates = req.body;

    // ✅ Validate: input must be an array
    if (!Array.isArray(updates)) {
        return next(new AppError("Invalid payload format. Expected an array of {_id, sortOrder}.", 400));
    }

    let modifiedCount = 0;

    for (const { _id, sortOrder } of updates) {
        // ✅ Validate _id format
        if (!mongoose.Types.ObjectId.isValid(_id)) continue;

        const result = await Category.findByIdAndUpdate(
            _id,
            { sortOrder },
            { new: false }
        );
        if (result) modifiedCount++;
    }

    return res.status(200).json({
        status: true,
        message: `Sort order updated for ${modifiedCount} subcategor${modifiedCount === 1 ? 'y' : 'ies'}.`,
        updatedCount: modifiedCount,
    });
});
