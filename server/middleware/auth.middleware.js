const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  let token = req.header('token');
  if (!token || token == "undefined") {
    return res.status(401).json({ message: "Unauthorized!" })
  }
  else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_STRING || "randomString");
      req.userId = decoded.user.id;
      next();
    } catch (e) {
      console.error(e);
      res.status(500).send({ message: "Invalid Token" });
    }
  }
};
module.exports = authMiddleware;