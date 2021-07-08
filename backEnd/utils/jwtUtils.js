const jwt = require("jsonwebtoken");

module.exports = {
  UserId: function (req) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    const UserId = decodedToken.UserId;
    return UserId;
  },
  isAdmin: function (req) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    const isAdmin = decodedToken.is_admin;
    return isAdmin;
  },
};
