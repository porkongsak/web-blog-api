const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');


//REGISTER
router.post("/register", async (req, res) => {
    try{

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password,salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        });

        const user = await newUser.save();
        res.status(200).json(user);
    } catch(err){
        res.status(500).json({ err:"err"});
    }
});


//LOGIN
router.post("/login", async (req, res ) => {
    try{
        const user = await User.findOne({ username: req.body.username});  // เข้าไปหา username: req.body.username ถ้าเจอ ก้อจะเอา password มาเทียบกับ password อีกที
        !user && res.status(400).json("Wrong credentials!");

                                                // การเปรียบเทีบระหว่าง password ที่รับมา กับ ใน ฐานข้อมูล
        const validated = await bcrypt.compare(req.body.password, user.password);
        !validated && res.status(400).json("Wrong credentials!");


        // ทำให้ไม่เเสดงรหัสต้อผู้ใช้
        const {  password, ...others } = user._doc;  // จะมีขูลมูลทุกอย่างยกเว้น password   ถ้าใส่ email ไปด้วย emailจะไม่เเสดงเหมือนกัน
        res.status(200).json(others)
    } catch (err) {
        res.status(500).json(err)
    }
});

module.exports = router;