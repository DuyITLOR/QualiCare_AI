const express = require("express");
const router = express.Router();
const authService = require("../services/authService");


router.post ("/register", async(req, res) => {
    try {
        const {email, password, phoneNumber, name, date} = req.body;
        const data = await authService.register(email, password, phoneNumber, name, date);
        res.json({success: true, data: data});
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
})

router.post("/login", async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await authService.login(email, password);
        res.json({success: true, data: user});
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
})

module.exports = router;