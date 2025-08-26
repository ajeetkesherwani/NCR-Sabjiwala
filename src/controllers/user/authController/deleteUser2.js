const User = require("../../../models/user");

exports.deleteUser2 = async (req, res) => {
    try {
        const { id } = req.params;
        // await User.findByIdAndDelete(id);
        res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>User Deleted</title>
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
                    color: #28a745;
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
                <h2>User Deleted</h2>
                <p>The user has been deleted successfully.</p>
            </div>
        </body>
        </html>
        `);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting driver");
    }
};
