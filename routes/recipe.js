const express = require('express');
const router = express.Router();
const Recipe = require('../models/RecipeSchema');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('coverImage'), async (req, res) => {
    const { title, ingredients, instructions } = req.body;
    if (!title || !ingredients || !instructions) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const newRecipe = await Recipe.create({
        title,
        ingredients,
        instructions
    });
    res.status(201).json(newRecipe);

});
router.get('/', async (req, res) => {
    try{
        
        
        const recipes = await Recipe.find();
        res.status(200).json(recipes);
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get a single recipe by ID
router.get('/:id', async (req, res) => {
    try{
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json(recipe);
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update a recipe by ID
router.put('/:id', async (req, res) => {
    try{
        const { title, ingredients, instructions } = req.body;

        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, { title, ingredients, instructions }, { new: true , runValidators: true});
        if (!updatedRecipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json(updatedRecipe);
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
// Delete a recipe by ID
router.delete('/:id', async (req, res) => {
    try{
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.status(200).json({ message: 'Recipe deleted' });
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;