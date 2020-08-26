const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

// database instance
const db = require("../../config/db");

// @route           POST api/userLocation
// @description     save user location
// @access          Private
router.post(
  "/",
  [
    auth,
    [
      check("userLatitude", "Latitude is required")
        .not()
        .isEmpty(),
      check("userLongitude", "Longitude is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userLatitude, userLongitude } = req.body;

    const userPhoneNumber = req.user.user.phonenumber;

    try {
      let sql = `SELECT id , name , nic , address_st1 , address_city , phone_no , address_gis_lat, address_gis_lng FROM customer WHERE phone_no = ${userPhoneNumber}`;
      db.query(sql, (err, results) => {
        if (err) {
          return res.status(400).send("Server error");
        }

        if (results.length === 0) {
          return res.status(400).json({ errors: [{ msg: "Server error" }] });
        } else {
          let location_sql = `UPDATE customer SET address_gis_lat = ${userLatitude} , address_gis_lng = ${userLongitude} WHERE phone_no = ${userPhoneNumber}`;
          db.query(location_sql, (err, results) => {
            if (err) {
              return res.status(400).send("Server error");
            }

            if (results.length === 0) {
              return res.status(400).send("Server error");
            } else {
              const status = 200; // location added

              res.send({
                status
              });
            }
          });
        }
      });
    } catch (error) {
      return res.status(400).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

module.exports = router;
