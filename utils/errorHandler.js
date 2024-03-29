module.exports = (err, req, res, next) => {
  if (err.statusCode) {
    console.log("oops");
    res.status(err.statusCode).send({ error: err.message });
  } else {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
};
