const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwtService = require("../../config/jwt");

// database instance
const db = require("../../config/db");

// @route           POST api/userLogin
// @description     Login user
// @access          Public
router.post(
  "/",
  [
    check("phonenumber", "Please enter a valid phone number")
      .isNumeric()
      .not()
      .isEmpty(),
    check("password", "password is required").exists()
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phonenumber, password } = req.body;

    try {
      // check if the user is found
      let sql = `SELECT * from customer WHERE phone_no = ${phonenumber}`;
      db.query(sql, (err, results) => {
        if (err) {
          return res.status(400).send("Error in query");
        }
        if (results.length === 0) {
          return res
            .status(400)
            .json({ errors: [{ msg: "Invalid credentials" }] });
        } else {
          // decrypting the password here and comparing with the password sent in the body
          bcrypt.compare(password, results[0].password, (err, result) => {
            if (result) {
              // returning json web token
              const payload = {
                id: results[0].id,
                phonenumber: results[0].phone_no,
                name: results[0].name
              };
              /*
              const USER = {
                id: results[0].id,
                phonenumber: results[0].phone_no,
                name: results[0].name
              };
              */
              // here we get tokens for the user
              const accessToken = jwtService.getAccessToken(payload);
              const status = 200;

              // sending user data and the token to client
              res.json({
                //USER,
                accessToken,
                status
              });
            } else {
              return res
                .status(400)
                .json({ errors: [{ msg: "Invalid credentials" }] });
            }
          });
        }
      });
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
