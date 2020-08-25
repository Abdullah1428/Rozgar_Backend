const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwtService = require("../../config/jwt");

// database instance
const db = require("../../config/db");

// @route           POST api/userRegistration
// @description     Register user in the database
// @access          Public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("cnic", "Please Enter a Valid CNIC number")
      .isLength({
        min: 13,
        max: 13
      })
      .not()
      .isEmpty(),
    check("address", "Address should not be empty")
      .not()
      .isEmpty(),
    check("city", "Mention your city")
      .not()
      .isEmpty(),
    check("phonenumber", "Enter a valid Phone Number")
      .not()
      .isEmpty(),
    check(
      "password",
      "Enter a valid password with at least 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // destructuring the req body
    const { name, cnic, address, city, phonenumber, password } = req.body;

    // encryption of user password
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(password, salt);

    // for now the location co ordinates will be null
    // we will create a separate route for it when the user confirm its location
    // from the app
    const lat = null;
    const lng = null;

    try {
      // check if the user already exists
      let sql = `SELECT * FROM customer WHERE phone_no = ${phonenumber}`;
      let query = db.query(sql, (err, result) => {
        if (err) {
          return res.status(400).send("Error in query");
        }
        if (result.length === 0) {
          // user does not exists so here we will continue our registration for user

          let data = {
            name: name,
            nic: cnic,
            password: pass,
            address_st1: address,
            address_city: city,
            phone_no: phonenumber,
            address_gis_lat: lat,
            address_gis_lng: lng
          };

          let sql2 = `INSERT INTO customer SET ?`;
          let query2 = db.query(sql2, data, (err, result) => {
            if (err) {
              return res.status(400).send("Error in query for registration");
            }
            if (result.length === 0) {
              return res.status(400).send("Error in query for registration");
            } else {
              //console.log(result);

              const payload = {
                phonenumber: phonenumber,
                name: name
              };

              const accessToken = jwtService.getAccessToken(payload);

              const status = 201;

              res.send({
                accessToken,
                status
              });
              //return res.status(200).send("Registration Successful");
            }
          });
        } else {
          return res.status(400).send("User does Exists");
        }
      });
    } catch (err) {
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
