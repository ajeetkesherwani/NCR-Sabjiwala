const Vendor = require("../../../models/vendor");


exports.deleteVendor = async (req, res) => {
    try {
        const { id } = req.params;

        // Optionally perform soft delete instead of hard delete
        // await Vendor.findByIdAndUpdate(id, { isDeleted: true });
        // await Vendor.findByIdAndDelete(id);
        console.log(id);

        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Vendor Deleted</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f2f2f2;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .message-box {
                    background-color: #fff;
                    padding: 30px;
                    border-radius: 12px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                    max-width: 90%;
                    width: 350px;
                }
                h2 {
                    color: #d9534f;
                    margin-bottom: 10px;
                }
                p {
                    font-size: 16px;
                    margin-bottom: 20px;
                    color: #555;
                }
                a {
                    text-decoration: none;
                    color: white;
                    background-color: #007bff;
                    padding: 10px 20px;
                    border-radius: 6px;
                    font-size: 14px;
                    display: inline-block;
                }
                a:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="message-box">
                <h2>Vendor Deleted</h2>
                <p>The vendor has been deleted successfully.</p>
                <a href="/api/vendor/delete-vendor">Back</a>
            </div>
        </body>
        </html>
        `);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting vendor");
    }
};
