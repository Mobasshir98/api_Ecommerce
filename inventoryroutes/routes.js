const express = require("express");
const router = express.Router();
const inventoryinfo = require("../models/Inventorytable");

router.get("/", (req, res) => {
  inventoryinfo.find({}, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.render("inventory", { database: docs });
    }
  });
});

module.exports=router;