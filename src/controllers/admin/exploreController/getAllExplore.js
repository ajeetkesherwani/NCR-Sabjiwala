const Explore = require("../../../models/explore");
const catchAsync = require("../../../utils/catchAsync");

// Get All
exports.getAllExplore = catchAsync(async (req, res) => {
    const exploreList = await Explore.find().populate("serviceId", "name");

    return res.status(200).json({
        status: true,
        data: exploreList,
    });
});