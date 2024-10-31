const express = require("express");
const { googleLogin } = require("../config/auth");

const router = express.Router();

router.post("/google-login", googleLogin);

module.exports = router;
