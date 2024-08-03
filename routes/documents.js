const express = require('express');
const Document = require('../models/Document');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/documents - Create a new document
router.post('/', auth, async (req, res) => {
    try { 
        const { title, content } = req.body;

        console.log('User ID:', req.user.id); 

        if (!req.user || !req.user.id) {
            return res.status(400).json({ error: 'User ID is missing' });
        }

        const document = new Document({
            title,
            content,
            owner: req.user.id
        });
        await document.save();
        res.status(201).json(document);
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating document', msg: error.message });
    }
});


// GET /api/documents - Get all documents for the authenticated user
router.get('/', auth, async (req, res) => {
    try{
        const documents = await Document.find({ owner: req.user.id });
        if (!documents) {
            return res.status(404).json({ error: 'Documents not found' });
        }
        res.json(documents);
    }
    catch (error) {
        res.status(500).json({ error: 'Error getting documents' });
    }
});


//GET /api/documents/:id - Get a specific document
router.get('/:id', auth, async (req, res) => {
    try{
        const document = await Document.findOne({ _id: req.params.id, owner: req.user.id });
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }
        res.json(document);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching document' });
    }
});


//PUT /api/documents/:id - Update a specific document
router.put('/:id', auth, async (req, res) => {
    try{
        const { title, content } = req.body;
        const document = await Document.findOneAndUpdate(
            { _id: req.params.id },
            { title, content, updateAt: Date.now() },
            { new: true }
        );

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.json(document);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating document' });
    }
});


//DELETE /api/documents/:id - Delete a specific document
router.delete('/:id', auth, async (req, res) => {
    try {
        const document = await Document.findOneAndDelete(
            { _id: req.params.id },
            { owner: req.user.id }
        );
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.json({ message: 'Document successfully deleted' });
    }   
    catch (error) {
        res.status(500).json({ error: 'Error deleting document' });
    }
}); 


module.exports = router;