
const Brand = require("../../../models/brand");
const catchAsync = require("../../../utils/catchAsync");

// // exports.getAllCategory = catchAsync(async (req, res, next) => {
// //     const allCategory = await Category.find({ cat_id: null, status: "active" })

// //     return res.status(200).json({
// //         status: "success",
// //         results: allCategory.length,
// //         data: allCategory
// //     });
// // })

// exports.getAllService = catchAsync(async (req, res, next) => {
//     const allService = await Service.find()

//     return res.status(200).json({
//         status: "success",
//         results: allService.length,
//         serviceData: allService
//     });
// })

exports.getAllBrand = catchAsync(async (req, res, next) => {

    const allBrand = await Brand.find({ status: "active" });

    return res.status(200).json({
        status: "success",
        results: allBrand.length,
        allBrand: allBrand
    });

})