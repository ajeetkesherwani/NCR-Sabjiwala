const Driver = require("../../../models/driver")
const catchAsync = require("../../../utils/catchAsync")


exports.getDriver = catchAsync(async (req, res) => {

    const allDriver = await Driver.find()


    return res.status(200).json({
        status: true,
        results: allDriver.length,
        data: allDriver
    })

})