exports.test = (req, res, next) => {
  // console.log("Hello this is test function!");
  return res.status(200).json({
    message: "this is test route in vendor",
  });
};
