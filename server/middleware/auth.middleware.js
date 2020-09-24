const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.header("token");
  if (!token) return res.status(401).json({ message: "Unauthorized!" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_STRING || "randomString");
    req.userId = decoded.user.id;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token" });
  }
};
module.exports = authMiddleware;