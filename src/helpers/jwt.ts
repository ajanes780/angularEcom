const expressJwt = require("express-jwt");
const api = process.env.API_URL;
const authJwt = () => {
  const secret = process.env.JWT;

  return expressJwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      { url: /\/api\/v1\/products(.*)/, methods: [`GET`, `OPTIONS`] },
      { url: /\/api\/v1\/categories(.*)/, methods: [`GET`, `OPTIONS`] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
};

module.exports = authJwt;
export {};
