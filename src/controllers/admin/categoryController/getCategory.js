const Category = require("../../../models/category");
const catchAsync = require("../../../utils/catchAsync");

exports.getCategory = catchAsync(async (req, res) => {
    // Fetch categories with priority 1-10
    const priorityCategories = await Category.find({ 
        cat_id: null,
        priority: { $gte: 1, $lte: 10 } 
    }).populate({path: "serviceId", select: "name"}).sort({ priority: 1 });

    // Fetch remaining categories
    const otherCategories = await Category.find({ 
        cat_id: null,
        $or: [
            { priority: { $gt: 10 } },
            { priority: { $lt: 1 } },
            { priority: null }
        ]
    }).populate({path: "serviceId", select: "name"}).sort({ priority: 1 });

    // Combine both results
    const allCategory = [...priorityCategories, ...otherCategories];

    return res.status(200).json({
        status: true,
        results: allCategory.length,
        data: allCategory
    })

})