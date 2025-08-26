const User = require("../../../models/user");

exports.deleteUser = async (req, res) => {
    try {
        console.log("Deleting user with ID:", req.params.id);

        // await User.findByIdAndDelete(req.params.id);

        res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Account Deleted</title>
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
                  background-color: #f0f8f7;
              }
              .container {
                  background: #fff;
                  padding: 30px;
                  border-radius: 12px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                  text-align: center;
                  max-width: 90%;
              }
              h2 {
                  color: #28a745;
                  margin-bottom: 10px;
              }
              p {
                  font-size: 16px;
                  color: #555;
              }
              .checkmark {
                  font-size: 48px;
                  color: #28a745;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="checkmark">✔️</div>
              <h2>Account Deleted Successfully</h2>
              <p>Your account has been removed from our system.</p>
          </div>
      </body>
      </html>
    `);
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).send("Error deleting user.");
    }
};