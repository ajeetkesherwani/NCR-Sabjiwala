const WalletRequest = require("../../../models/walletRequest");
const catchAsync = require("../../../utils/catchAsync");

exports.changeStatusWalletRequest = catchAsync(async (req, res, next) => {
    try {

        const id = req.params.requestId
        let { status } = req.body

        if (!id) return res.status(400).json({ message: "Wallet request id is required", status: "notsuccess" });
        if (!status) return res.status(400).json({ message: "Status is required", status: "notsuccess" });

        const walletRequest = await WalletRequest.findById(id);
        if (!walletRequest) return res.status(404).json({ message: "Wallet request not found", status: "notsuccess" });


        walletRequest.status = status;
        await walletRequest.save();

        return res.status(201).json({ message: `Request ${status}`, status: "success", walletRequest });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong", status: "notsuccess", error: error.message });
    }
})