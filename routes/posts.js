const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");



//  CREATE POST
// {
//     "username":"jane",
//     "title":"from jsne",
//     "desc":"test desc"
  
// }
router.post("/", async (req, res) => {
   const newPost = new Post(req.body);
   try{
        const savePost = await newPost.save();
        res.status(200).json(savePost);
   } catch (err) {
        res.status(500).json(err)
   }
});
 

//  UPDATE POST
router.put("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id); // Post.findById เข้าไปหาid ของ Post
         //ตรวจสอบไอดี ผู้ใช้ของเรา
         if(post.username === req.body.username){ // post.username ที่หามาจาก db ต้อง เหมือนกับ ที่ req มา  เพื่อให้เราสามารถอัพเดทได้
            try{
                const updatePost = await Post.findByIdAndUpdate(
                    req.params.id,
                    {
                    // ตั้งค่า คุณสมบัติใหม่   $set ต่อด้วยที่จะตั้งค่า
                        $set: req.body,    // รวบรวมทั้งหมด
                    },
                    { new : true } // จะเห็นโพสอัพเดทใหม่ให้เป็นจริง
                );
                res.status(200).json(updatePost);
            } catch (err) {
                res.status(500).json(err);
            }

        } else {
            res.status(401).json("You can update only your post")
        }

    } catch(err) {
        res.status(500).json(err);
    }
   
});

// DELET POST
router.delete("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id); // Post.findById เข้าไปหาid ของ Post
         //ตรวจสอบไอดี ผู้ใช้ของเรา
         if(post.username === req.body.username){ // post.username ที่หามาจาก db ต้อง เหมือนกับ ที่ req มา  เพื่อให้เราสามารถอัพเดทได้
            try{
                // เมื่อเจอ post ก้อลบเลย
                await post.delete();
                res.status(200).json(" Post has been delete...");
            } catch (err) {
                res.status(500).json(err);
            }

        } else {
            res.status(401).json("You can delete only your post")
        }

    } catch(err) {
        res.status(500).json(err);
    }
   
});

 // GET POST 
 // หาโพสโดย ค้นหาด้วยไอดี
 router.get("/:id", async(req, res) => {
     try{
        const post = await Post.findById(req.params.id);
        res.status(200).json(post)
     } catch (err) {
        res.status(500).json(err);
     }
 })

// GET ALL POST 
router.get("/", async(req, res) => {
    const username = req.query.user;
    const catName = req.query.cat;
    try{
        let posts ; // สามารถเปลี่ยนแปลงได้
        if (username) {
            posts = await Post.find({ username });
        } else if (catName){
            posts = await Post.find({
                categories: {
                    $in: [catName],
                }
            });
        } else{
            posts = await Post.find();
        }
        res.status(200).json(posts);
    } catch (err) {
       res.status(500).json(err);
    }
});
module.exports = router;

