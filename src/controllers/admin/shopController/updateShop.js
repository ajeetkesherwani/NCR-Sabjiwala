const Shop = require("../../../models/shop");
const catchAsync = require("../../../utils/catchAsync");
const deleteOldFiles = require("../../../utils/deleteOldFiles");

exports.updateShop = catchAsync(async (req, res) => {
    let shopId = req.params.shopId;
    let { name, serviceId, vendorId, address, priority } = req.body;

    let shop = await Shop.findById(shopId);
    if (!shop) {
        return res.status(404).json({
            status: false,
            message: "Shop not found.",
        });
    }

    // Update fields
    shop.name = name || shop.name;
    shop.serviceId = serviceId || shop.serviceId;
    shop.vendorId = vendorId || shop.vendorId;
    shop.address = address || shop.address;

    console.log("Updating shop with ID:", shopId);
    console.log(req.body);

    // Handle priority logic
    if (priority !== undefined) {
        let newPriority = null;

        // If priority is a number or string number
        if (priority !== null && priority !== '') {
            const parsed = Number(priority);
            if (!isNaN(parsed)) {
                newPriority = parsed;
            }
        }

        console.log(newPriority)

        // If current priority is different from new priority
        if (shop.priority !== newPriority) {
            // Find if any other shop has the same priority
            const existingShop = await Shop.findOne({ 
                _id: { $ne: shopId },  // exclude current shop
                priority: newPriority 
            });

            if (existingShop) {
                // Swap priorities
                existingShop.priority = shop.priority;
                await existingShop.save();
            }

            console.log(`Updating shop ${shopId} priority from ${shop.priority} to ${newPriority}`);
            // Set new priority
            shop.priority = newPriority;
        }
    }

    await shop.save();

    return res.status(200).json({
        status: true,
        message: "Shop updated successfully.",
        data: { shop },
    });
});
