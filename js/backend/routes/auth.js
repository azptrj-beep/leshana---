const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {

  const { username } = req.body;

  res.json({
    success: true,
    token: "fake-jwt-token",
    username
  });
});

module.exports = router;