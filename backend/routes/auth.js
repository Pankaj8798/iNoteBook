const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchUser");
const fs = require('fs');
const path = require('path');
const { log } = require("console");

// Create a User using: POST "/api/register" no login required
router.post("/register", [
    body('name', 'Name must be atleast 3 characters').trim().isLength({ min: 3 }),
    body('email', 'Enter a valid email').trim().isEmail().custom(async (value) => {
        let user = await User.findOne({ email: value });
        if (user) {
            throw new Error("User already exists");
        }
        return true;
    }),
    body('password', 'Password must be atleast 5 characters').trim().isLength({ min: 5 }),
], async (req, res) => {
    console.log(req.body);
    
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const data = matchedData(req);
        let user = await User.findOne({ email: data.email });
        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(data.password, salt);
        user = await User.create({
            name: data.name,
            email: data.email,
            password: secPass
        });

        const tokenData = {
            user: {
                id: user.id
            }
        };
        
        const authToken = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({authToken});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// Authenticate a User using: POST "/api/login" no login required
router.post("/login", [
    body('email', 'Enter a valid email').trim().isEmail(),
    body('password', 'Password cannot be blank').trim().notEmpty(),
], async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const data = matchedData(req);
    try {
        let user = await User.findOne({ email: data.email });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(data.password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        const tokenData = {
            user: {
                id: user.id
            }
        };

        const authToken = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// Get logged in User Details using: GET "/api/user" login required
router.get("/user", fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// Update logged in User Details using: PUT "/api/user/update" login required
router.put("/user/update", fetchuser, [
    body('name', 'Name must be atleast 3 characters and max 30').trim().isLength({ min: 3, max: 30 }),
], async (req, res) => {
    try {
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let newUser = { name: req.body.name };
        const userId = req.user.id;

        if (req.files) {
            const profileImage = req.files.profile_picture; // The uploaded file
            const uploadPath = path.join(__dirname, '../../public/uploads', userId); // User's folder path
            
            // Create the user's directory if it doesn't exist
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }

            // Remove existing files in user's folder
            await fs.remove(uploadPath);

            // Ensure the user's directory exists
            await fs.ensureDir(uploadPath);            

            // Generate a unique file name for the uploaded file
            const fileName = `${Date.now()}-${profileImage.name}`;
            const filePath = path.join(uploadPath, fileName);
            profileImage.mv(filePath, (err) => {
                if (err) {
                    res.send(err);
                }
            });
            newUser.profile_picture = `/uploads/${userId}/${fileName}` 
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { $set: newUser }, { new: true });
        res.json(updatedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Change Password for logged in User using: PUT "/api/user/change-password" login required
router.put("/user/change-password", fetchuser, [
    body('password', 'Password must be atleast 5 characters').trim().isLength({ min: 5, max: 30 }),
    body('cpassword', 'Confirm Password must be atleast 5 characters').trim().isLength({ min: 5, max: 30 }).custom(async (value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Confirm Password does not match password');
        }
        return true;
    })
], async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        const data = matchedData(req);
        const { password } = data;
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);

        let newUser = {};
        if (secPass) { newUser.password = secPass }

        const userId = req.user.id;
        await User.findByIdAndUpdate(userId, { $set: newUser }, { new: true });
        res.status(200).send("Password Updated successfully.");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;