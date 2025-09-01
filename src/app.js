const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

const { appRoutes } = require("./routes/appRoutes");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

const allowedOrigins = ['http://localhost:5173', "https://ncrsabziwala.com"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(morgan("dev"));
app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: "this is home route" })
})
router.get("/test", (req, res) => {
  res.status(200).json({ message: "this is test route" });
});

app.use(router);

// testing middleware
// app.use("/", (req, res, next) => {
//   console.log("Slash route is working");
//   console.log(req.body);
//   next();
// });

appRoutes(app);

//not exist route handle here
app.all("*", (req, res, next) => {
  return next(
    new AppError(`The route ${req.originalUrl} not run on this server.`, 404)
  );
});

app.use(globalErrorHandler);
module.exports = app;
