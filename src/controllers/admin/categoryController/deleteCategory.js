const Category = require("../../../models/category");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.deleteCategory = catchAsync(async(req,res)=>{
    let id = req.params.id

    const category = await Category.findById(id);
    // await deleteOldFiles(category.image)
    await Category.findByIdAndDelete(id)


    return res.status(200).json({
        status: true,
        message: "Category deleted successfully",
        data: category
    })

})