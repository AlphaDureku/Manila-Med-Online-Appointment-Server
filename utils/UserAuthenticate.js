module.exports = (req, res, next) => {
  if (req.session.user_ID) {
    next();
  } else {
    console.log("oops");
    res.redirect("/");
  }
};
