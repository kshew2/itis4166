const model = require('../models/user');
const connection = require('../models/connections');

exports.new = (req, res)=>{
        return res.render('./user/new');
};

exports.create = (req, res, next)=>{
    
    let user = new model(req.body);
    if(user.email)
        user.email = user.email.toLowerCase();
    user.save()
    .then(user=> {
        req.flash('success', 'Registration succeeded!');
        res.redirect('/users/login');
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('back');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email has been used');  
            return res.redirect('back');
        }
        next(err);
    }); 
    
};

exports.getUserLogin = (req, res, next) => {
        return res.render('./user/login');
}

exports.login = (req, res, next)=>{
    let email = req.body.email;
    if(email)
        email = email.toLowerCase();
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            req.flash('error', 'wrong email address');  
            res.redirect('/users/login');
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        // Add other user properties as needed
                    };
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/');
            } else {
                req.flash('error', 'wrong password');      
                res.redirect('/users/login');
            }
            });     
        }     
    })
    .catch(err => next(err));
};

exports.profile = async (req, res, next) => {
    // Ensure req.session.user exists and contains _id
    if (!req.session.user || !req.session.user._id) {
        // Handle the case where user data is missing
        // For example, redirect to a login page or display an error
        return res.redirect('/login'); // Adjust the route as needed
    }

     // Access _id from req.session.user

    try {
        const userId = req.session.user._id;
        const user = await model.findById(userId);
        // Fetch unique topics from the user's connections
        const topics = await connection.distinct('topic', { host: userId });

        // Now you have the topics, fetch the user's connections
        const connections = await connection.find({ host: userId });

        res.render('./user/profile', { user, topics, connections });
    } catch (err) {
        next(err);
    }
};


exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
   
 };



