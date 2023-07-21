const model = require('../models/connections');
//GET /about- send about page
exports.about =  (req, res)=>{
    res.render('./main/about');
};


//GET /contact send contact page
exports.contact =  (req, res)=>{
    res.render('./main/contact');
};