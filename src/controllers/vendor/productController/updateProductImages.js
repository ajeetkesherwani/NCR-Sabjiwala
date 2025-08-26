const VendorProduct = require("../../../models/vendorProduct");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
// const deleteOldFiles = require("../../../utils/deleteOldFiles"); // optional

exports.updateProductImages = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { galleryIndex, deleteGalleryIndex } = req.body;
    console.log("Working -----------------------")

    const product = await VendorProduct.findById(id);
    if (!product) return next(new AppError("Product not found", 404));

    // -------- Update Primary Image --------
    if (req.files?.primary_image?.length > 0) {
        const newPrimary = req.files.primary_image[0];
        // await deleteOldFiles(product.primary_image); // optional
        product.primary_image = `${newPrimary.destination}/${newPrimary.filename}`;
    }

    // -------- Replace Specific Gallery Image --------
    if (
        req.files?.gallery_image?.length > 0 &&
        typeof galleryIndex !== "undefined"
    ) {
        const index = parseInt(galleryIndex);
        const newGallery = req.files.gallery_image[0];
        if (product.gallery_image?.[index]) {
            // await deleteOldFiles(product.gallery_image[index]); // optional
            product.gallery_image[index] = `${newGallery.destination}/${newGallery.filename}`;
        } else {
            return next(new AppError("Gallery image index invalid", 400));
        }
    }

    // -------- Delete Specific Gallery Image --------
    if (typeof deleteGalleryIndex !== "undefined") {
        const index = parseInt(deleteGalleryIndex);
        if (product.gallery_image?.[index]) {
            // await deleteOldFiles(product.gallery_image[index]); // optional
            product.gallery_image.splice(index, 1);
        } else {
            return next(new AppError("Gallery image index invalid", 400));
        }
    }

    // -------- Add New Gallery Images --------
    if (
        req.files?.gallery_image?.length > 0 &&
        typeof galleryIndex === "undefined" &&
        typeof deleteGalleryIndex === "undefined"
    ) {
        const newGalleryImages = req.files.gallery_image.map(
            (file) => `${file.destination}/${file.filename}`
        );
        product.gallery_image.push(...newGalleryImages);
    }

    await product.save();

    return res.status(200).json({
        status: true,
        message: "Product images updated successfully.",
        data: { product },
    });
});
