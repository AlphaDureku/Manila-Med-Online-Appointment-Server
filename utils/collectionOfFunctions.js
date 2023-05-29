exports.upperCaseFirstLetter = (params) => {
  const words = params.split(" ");
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  return capitalizedWords.join(" ");
};

exports.sessionDestroy = (req) => {
  req.session.destroy();
};

exports.formatContactNumber = (contactNumber) => {
  if (contactNumber.startsWith("09")) {
    return "+639" + contactNumber.substring(2);
  } else if (contactNumber.startsWith("639")) {
    return "+639" + contactNumber.substring(3);
  } else {
    return contactNumber;
  }
};
