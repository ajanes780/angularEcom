const admin = (req, res, next) => {
  if (req.user.isAdmin === false) {
    res.json({ message: "Permission denied." });
  } else {
    next();
  }
};

module.exports = admin;
export {};
