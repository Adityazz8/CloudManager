const express = require('express');
const router = express.Router();
const { body,validationResult } = require('express-validator');
const userModel = require('../models/user.model');
const brcypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* /user/test */
// router.get('/test', (req, res) => {
//     res.send('This is a user test route');
// })
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', 
    body('email').trim().isEmail().withMessage('Enter a valid email address').isLength({min:13}).withMessage('Email must be at least 13 characters long')   ,
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
        const hashPasword = await brcypt.hash(password, 10)
        const newUser = await userModel.create({ 
            username, email,password:hashPasword
        })
        res.json(newUser)
    })

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login',
    body('username').trim().isLength({min:3}).withMessage('Username must be at least 3 characters long')   ,
    body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    async (req, res) => { 
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid input data'
            })
        }
        const { username, password } = req.body;

        const user = await userModel.findOne({ username: username });
        if(!user){
            return res.status(400).json({ message: 'username or password is incorrect' })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: 'username or password is incorrect' })
        }

        const token = jwt.sign(
        { userId: user._id, username: user.username },
            process.env.JWT_SECRET
            
        );
        res.json({ token });        
    })        


module.exports = router;

// To use this route, you would typically import and use it in your main app.js file like so:
// const userRoutes = require('./routes/user.routes');
// app.use('/user', userRoutes);