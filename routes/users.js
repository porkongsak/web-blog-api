const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");


//  UPDATE
router.put("/:id", async (req, res) => {
    if(req.body.userId === req.params.id ) {    // req.params.id เอามาจากค่าพารามิเตอ url
        
        if (req.body.password){
         const salt = await bcrypt.genSalt(10);
         req.body.password = await bcrypt.hash(req.body.password, salt)       
        }
        try{
           const updateUser = await User.findByIdAndUpdate(req.params.id, {
               $set: req.body,
           },
           { new: true } // อัพเดทผู้ใช้รายใหม่ ไม่ใช้เก่า
           );
           res.status(200).json(updateUser);
        } catch(err){
            res.status(500).json({ err:"err"});
        }
    } else {
        res.status(401).json(" You can update only your accout ");
    }
   
});
 

// ลบโพสไม่ต้องทั้งหมด
// DELETE 
router.delete("/:id", async (req, res) => {
    if(req.body.userId === req.params.id ) {    // req.params.id เอามาจากค่าพารามิเตอ url
        try{
            const user = await User.findById(req.params.id); // ค้นหา id ของผู้ใช้      Userนี้ เอามาจาก const User = require("../models/User");
            try{
                await Post.deleteMany({ username: user.username }); // ชื่อผู้ใช้  ตามที่เรากำหนดไว้ใน Schema ของ Post.js  โดยตรวจสอบผู้ใช้งานนี้ ใช้ร่ายการเดียวกับ const user = await User.findById(req.params.id); ใน db หรือป่าว
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("User has been deleted...");
             } catch (err) {
                 res.status(500).json({ err:"err"});
             }
        } catch(err) {
            res.status(401).json("User not found")
        }
    } else {
        res.status(401).json(" You can delet only your accout ");
    }
   
});

 //GET  USER
 router.get("/:id", async(req, res) => {
     try{
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc; //ไม่ให้เเสดงpassword ตอนที่ดึงมา
        res.status(200).json(others)
     } catch (err) {
        res.status(500).json(err);
     }
 })


module.exports = router;