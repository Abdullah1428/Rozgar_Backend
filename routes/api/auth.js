const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const db = require("../../config/db");

// @route api/auth
// @description we will hit this point again and again to check if the user is logged in with the valid token
// if yes we will direct him to the main page else we will direct him to login
// @access private and protected route

router.get("/", auth, async (req, res) => {
  let sql = `SELECT id , name , nic , address_st1 , address_city , phone_no , address_gis_lat, address_gis_lng FROM customer WHERE id = ${req.user.id}`;

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send("Server Error");
    }
    if (result.length === 0 || typeof result === "undefined") {
      res.status(500).send("Server Error");
    } else {
      const USER = {
        id: result[0].id,
        name: result[0].name,
        nic: result[0].nic,
        address: result[0].address_st1,
        city: result[0].address_city,
        phonenumber: result[0].phone_no,
        lat: result[0].address_gis_lat,
        lng: result[0].address_gis_lng
      };

      res.send({
        USER
      });
    }
  });
});

module.exports = router;
