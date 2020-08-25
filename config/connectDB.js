const db = require("./db");

const ConnectDB = async () => {
  try {
    db.connect(err => {
      if (err) {
        throw err;
      }
      console.log("Connected to the DB successfully");
    });
  } catch (error) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = ConnectDB;
