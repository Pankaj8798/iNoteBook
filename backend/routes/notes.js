const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Note = require("../models/Note");
const { body, validationResult, matchedData } = require("express-validator");

// Get all the Notes using: GET "/api/notes" login required
router.get("/", fetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user_id: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Add a Note using: POST "/api/notes" login required
router.post("/", fetchUser, [
    body('title', 'Title must be atleast 3 characters').trim().isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').trim().isLength({ min: 5 }),
    body('tag', 'Tag must be atleast 3 characters').trim().isLength({ min: 3 }).optional()
], async (req, res) => {
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const data = matchedData(req);
        const { title, description, tag } = data;
        const note = await Note.create({
            title, description, tag, user_id: req.user.id
        });
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Update a Note using: PUT "/api/notes/:id" login required
router.put("/:id", fetchUser, [
    body('title', 'Title must be atleast 3 characters').trim().isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').trim().isLength({ min: 5 }),
    body('tag', 'Tag must be atleast 3 characters').trim().isLength({ min: 3 })
], async (req, res) => {

    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let note = await Note.findById(req.params.id);

        // Check whether note exists or not
        if (!note) { return res.status(404).send("Not Found") }

        // Allow updation only if user owns this Note
        if (note.user_id.toString() !== req.user.id) { return res.status(401).send("Not Allowed") }

        const data = matchedData(req);
        const { title, description, tag } = data;

        let newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        const updatedNote = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(updatedNote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Delete a Note using: DELETE "/api/notes/:id" login required
router.delete("/:id", fetchUser, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);

        // Check whether note exists or not
        if (!note) { return res.status(404).send("Not Found") }

        // Allow updation only if user owns this Note
        if (note.user_id.toString() !== req.user.id) { return res.status(401).send("Not Allowed") }

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "message": "Note has been deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;