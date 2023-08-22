//require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const mainRoutes = require('./routes/mainRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const userRoutes = require('./routes/userRoutes');

//create app
const app = express();

require('dotenv').config()
//configure app
//let port = 3000;
const port = process.env.PORT || 3000;
//let host = 'localhost';
app.set('view engine', 'ejs');

//'mongodb://127.0.0.1:27017/NBAD'
//connect to MongoDB
mongoose.connect(process.env.MONGO_CONNECTION, 
                {useNewUrlParser: true, useUnifiedTopology: true/*, useCreateIndex: true */})
.then(()=>{
    //start the server
    app.listen(port,/* host, */()=>{
    console.log('Server is runnin on port', port);
});
})
.catch(err=>console.log(err.message));

//mount middleware
app.use(
    session({
        secret: "sasajfmcieo34w4nj4lfjf",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: process.env.MONGO_CONNECTION}),
        cookie: {maxAge: 60*60*1000}
    })
);
app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user||null;
    //console.log(req.session.user)
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});


app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

//set up routes
app.get('/',(req, res)=>{
    res.render('index');
});

app.use('/connections', connectionRoutes);

app.use('/', mainRoutes);

app.use('/users', userRoutes);

//error handling
app.use((req, res, next) =>{
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});
app.use((err, req, res, next)=>{
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('error', {error: err});
});