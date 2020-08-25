const jwt = require("jsonwebtoken");
const config = require("config");
//const { v1: uuidv1 } = require("uuid");

function getAccessToken(payload) {
  const accessToken = jwt.sign({ user: payload }, config.get("jwtSecret"), {
    expiresIn: config.get("accessTokenExpire")
  });
  return accessToken;
}
module.exports = {
  getAccessToken
};
