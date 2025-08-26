const express = require("express");

const adminRoutes = require("./adminRoutes");
const vendorRoutes = require("./vendorRoutes");
const userRoutes = require("./userRoutes");
const driverRoutes = require("./driverRoutes");

exports.appRoutes = (app) => {
  app.use("/public", express.static("public"));
  app.use("/api/admin", adminRoutes);
  app.use("/api/vendor", vendorRoutes);
  app.use("/api/user", userRoutes)
  app.use("/api/driver", driverRoutes);
};
