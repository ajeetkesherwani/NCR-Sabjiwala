const Category = require("../../../models/category");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.updateCategory = catchAsync(async (req, res) => {
    let id = req.params.id;
    let { name, cat_id, type, serviceId, priority } = req.body;

    console.log(req.body)

    let category = await Category.findById(id);
    if (!category) {
        return res.status(404).json({
            status: false,
            message: "Category not found.",
        });
    }

    let imageNew = category.image;
    if (req.files && req.files.image && req.files.image.length > 0) {
        imageNew = `${req.files.image[0].destination}/${req.files.image[0].filename}`;
        // Optional: delete old image
        // await deleteOldFiles(category.image);
    }

    // Update fields
    category.name = name || category.name;
    category.type = type || category.type;
    category.serviceId = serviceId || category.serviceId;
    category.image = imageNew;
    if (cat_id) category.cat_id = cat_id;

    // Handle priority logic
    // Handle priority logic
    if (Object.prototype.hasOwnProperty.call(req.body, "priority")) {
        let newPriority = null;

        if (
            priority !== null &&
            priority !== "null" &&
            priority !== "" &&
            priority !== "no-priority"
        ) {
            const parsed = Number(priority);
            if (!isNaN(parsed)) {
                newPriority = parsed;
            }
        }

        if (newPriority === null) {
            category.priority = null;
        } else if (category.priority !== newPriority) {
            const existingCategory = await Category.findOne({ priority: newPriority });
            if (existingCategory) {
                existingCategory.priority = category.priority || null;
                await existingCategory.save();
            }
            category.priority = newPriority;
        }
    }

    await category.save();

    return res.status(200).json({
        status: true,
        message: "Category updated successfully.",
        data: { category },
    });
});
