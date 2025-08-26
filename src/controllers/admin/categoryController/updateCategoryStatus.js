const Category = require("../../../models/category");
const catchAsync = require("../../../utils/catchAsync");

exports.updateCategoryStatus = catchAsync(async (req, res) => {

    let id = req.params.id
    let { status } = req.body

    const category = await Category.findOneAndUpdate({ _id: id }, { $set: { status: status } }, { new: true });

    if (!category) return new AppError("Category not found", 404)

    return res.status(200).json({
        status: true,
        data: { category }
    })

})