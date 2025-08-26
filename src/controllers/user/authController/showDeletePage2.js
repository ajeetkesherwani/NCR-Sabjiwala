exports.showDeletePage2 = (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Delete User</title>
        <style>
            * { box-sizing: border-box; }
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
            .container {
                background: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                width: 90%;
                max-width: 400px;
                text-align: center;
            }
            input {
                padding: 10px;
                width: 100%;
                margin: 15px 0;
                border: 1px solid #ccc;
                border-radius: 6px;
                font-size: 16px;
            }
            button {
                background-color: #d9534f;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 6px;
                font-size: 16px;
                cursor: pointer;
                width: 100%;
            }
            button:hover {
                background-color: #c9302c;
            }
            #modal {
                display: none;
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background-color: rgba(0,0,0,0.5);
                justify-content: center;
                align-items: center;
            }
            .modal-content {
                background: white;
                padding: 20px;
                border-radius: 10px;
                max-width: 90%;
                text-align: center;
            }
            .close-btn {
                background: #6c757d;
                margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Delete User</h2>
            <input type="text" id="mobile" placeholder="Enter mobile number" />
            <button onclick="findUser()">Find & Delete</button>
        </div>

        <div id="modal">
            <div class="modal-content">
                <h3>Confirm Deletion</h3>
                <p id="userDetails"></p>
                <form id="deleteForm" method="POST">
                    <button type="submit">Yes, Delete</button>
                </form>
                <button class="close-btn" onclick="closeModal()">Cancel</button>
            </div>
        </div>

        <script>
            async function findUser() {
                const mobile = document.getElementById('mobile').value.trim();
                if (!mobile) {
                    alert("Please enter a mobile number");
                    return;
                }

                try {
                    const res = await fetch('/api/user/find-user', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ mobile })
                    });

                    const data = await res.json();

                    if (!data.success) {
                        alert(data.message || "User not found");
                        return;
                    }

                    const user = data.user;

                    document.getElementById('userDetails').innerHTML = 
                        '<strong>Name:</strong> ' + user.name + '<br>' +
                        '<strong>Mobile:</strong> ' + user.mobileNo + '<br>' +
                        '<strong>Email:</strong> ' + (user.email || 'N/A');

                    document.getElementById('deleteForm').action = '/api/user/delete-user/' + user._id;
                    document.getElementById('modal').style.display = 'flex';
                } catch (error) {
                    console.error(error);
                    alert("Something went wrong");
                }
            }

            function closeModal() {
                document.getElementById('modal').style.display = 'none';
            }
        </script>
    </body>
    </html>
    `);
};
