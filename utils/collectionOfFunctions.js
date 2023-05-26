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
