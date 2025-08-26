
const User = require("../../../models/user");

exports.showDeletePage = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.send("User not found");

        res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Delete User</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #f9f9f9;
                }
                .container {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    max-width: 90%;
                    text-align: center;
                }
                h2 {
                    color: #d9534f;
                }
                p {
                    font-size: 16px;
                    margin: 10px 0;
                }
                button {
                    background-color: #d9534f;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    font-size: 16px;
                    border-radius: 5px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #c9302c;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Are you sure you want to delete this user?</h2>
                ${user.name ? `<p><strong>Name:</strong> ${user.name}</p>` : ""}
                <form method="POST" action="/api/user/delete-user/${user._id}">
                    <button type="submit">Yes, Delete</button>
                </form>
            </div>
        </body>
        </html>
        `);
    } catch (error) {
        console.log(error)
        res.status(500).send("Server error");
    }
};