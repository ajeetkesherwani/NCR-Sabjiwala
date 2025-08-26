// process.on("uncaughtException", (err) => {
//   console.log("UNCAUGHT EXCEPTION! Shutting down...");
//   console.log(err.name, err.message);
//   console.log(err.stack);
//   process.exit(1);
// });
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const app = require("./src/app");

// dotenv.config({ path: "config.env" });

// mongoose
//   .connect(process.env.DB_URL)
//   .then(() => console.log("Connection created successfully."))
//   .catch((err) => console.log(err));

// const Port = process.env.PORT || 7001;
// const server = app.listen(Port, () =>
//   console.log(`Server running on port: ${Port}`)
// );

// process.on("unhandledRejection", (err) => {
//   console.log("UNHANDLED REJECTION! Shutting down...");
//   console.log(err.name, err.message);
//   console.log(err.stack);
//   server.close(() => {
//     process.exit(1);
//   });
// });




//--------------------------------------------------------
//    finial code including socket.io
//--------------------------------------------------------

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  console.log(err.stack);
  process.exit(1);
});
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./src/app");

// new code
const http = require("http"); // Required for raw server
const { Server } = require("socket.io");

dotenv.config({ path: "config.env" });

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Connection created successfully."))
  .catch((err) => console.log(err));

// const Port = process.env.PORT || 7001;

// new code
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://gorabit.in"
];
const io = new Server(server, {
  cors: {
    origin: "*", // Allow frontend dev origin or production domain
    methods: ["GET", "POST"]
  }
});

// Store socket instance globally if needed
global.io = io;

io.on("connection", (socket) => {
  const { userId, role } = socket.handshake.query;

  if (role === "vendor") {
    socket.join(`vendor-${userId}`);
    console.log(`Vendor ${userId} connected to room vendor-${userId}`);
  } else if (role === "admin") {
    socket.join("admin");
    console.log(`Admin connected`);
  }

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


const Port = process.env.PORT || 7001;
server.listen(Port, () =>
  console.log(`Server running on port: ${Port}`)
);











// const server = app.listen(Port, () =>
//   console.log(`Server running on port: ${Port}`)
// );

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  console.log(err.stack);
  server.close(() => {
    process.exit(1);
  });
});