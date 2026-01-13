const express = require('express');
const userRouter = require('./routes/user.routes');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const connectToDB = require('./config/db')
connectToDB();
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const indexRouter = require('./routes/index.routes');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use('/user', userRouter)
app.use('/', indexRouter)

// Redirect helper routes
app.get('/login', (req, res) => {
    res.redirect('/user/login');
});

app.get('/register', (req, res) => {
    res.redirect('/user/register');
});

app.get('/', (req, res) => {
    const token = req.cookies.token;
    if (token) {
        res.redirect('/home');
    } else {
        res.redirect('/user/login');
    }
});

app.listen(3000,() => {
    console.log('server is running on port 3000');
})
