const expressJwt = require("express-jwt");

const authJwt = () => {
  const secret = process.env.JWT;

  return expressJwt({
    secret,
    algorithms: ["HS256"],
  });
};

module.exports = authJwt;
export {};
