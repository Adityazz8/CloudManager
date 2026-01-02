const express = require('express');
const router = express.Router();
const { body,validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const FileModel = require('../models/file.model');
const auth = require('../middleware/auth');

/* /user/test */
// router.get('/test', (req, res) => {
//     res.send('This is a user test route');
// })
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', 
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('username').trim().notEmpty().withMessage('Username is required').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    async (req, res) => {

        const errors = validationResult(req);
        console.log(errors);

        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                errors: errors.array(),
                message : 'Invalid input data'
            });
        }    

        const { username, email, password } = req.body;

        const hashPasword = await bcrypt.hash(password, 10)
        const newUser = await userModel.create({ 
            email,
            username,
            password:hashPasword
        })
        res.json(newUser)
    })

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login',
    body('username').trim().isLength({min:3}),
    body('password').trim().isLength({ min: 6 }),

    async (req, res) => { 

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid input data'
            })
        }
        const { username, password } = req.body;
        const user = await userModel.findOne({ 
            username: username 
        });
        
        if(!user){
            return res.status(400).json({
                message: 'username or password is incorrect'
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({
                 message: 'username or password is incorrect' 
                })
        }

        const token = jwt.sign({ 
            userId: user._id, 
            email: user.email,
            username: user.username 
        },
        process.env.JWT_SECRET,
            
        )
        res.cookie('token', token)
        res.send('Login successful')
    }
)      

// Multer setup for local uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
        cb(null, name);
    }
});
const upload = multer({ storage: storage, limits: { fileSize: 200 * 1024 * 1024 } }); // 200MB limit

// Protected upload route
router.post('/upload', auth, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const f = await FileModel.create({
        owner: req.user.userId,
        originalName: req.file.originalname,
        filename: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
    });
    res.json({ file: f });
});

// Protected download/serve route
router.get('/file/:id', auth, async (req, res) => {
    const file = await FileModel.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });
    if (file.owner.toString() !== req.user.userId) return res.status(403).json({ message: 'Forbidden' });
    res.sendFile(path.resolve(file.path));
});

module.exports = router;

// To use this route, you would typically import and use it in your main app.js file like so:
// const userRoutes = require('./routes/user.routes');
// app.use('/user', userRoutes);