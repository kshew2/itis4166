const model = require('../models/connections');

//GET /connections- send connections page 

exports.connections = (req, res, next)=>{
    //res.send(model.find());
    model.find()
    //model.returnTopics()
    .then(connection=>{
        let topics = [];
        connection.forEach(index => {if(topics.includes(index.topic) == false)
        topics.push(index.topic)});
        res.render('./connections/connections', {connection, topics})
        
})
    .catch(err=>next(err));
};

//GET /connections/newConnection

exports.newConnections = (req, res)=>{
    res.render('./connections/newConnection');
};


//POST /connection create new connection

exports.create =  (req, res, next)=>{
    //res.send('Created new connection');
    let connection= new model(req.body);
    connection.host = req.session.user;
    connection.save()
    .then(connections=> {
        req.flash('success', 'Connection has been successfully created');
        res.redirect('/connections');
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            req.flash('error', err.message);
            return res.redirect('/back');
        }
        next(err);
    });
    
};


//GET /connections/connection-show details by id
exports.show =  (req, res, next)=>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }

    model.findById(id).populate('host', 'firstName lastName')
    .then(connections=>{
        if(connections){
           return res.render('./connections/connection', {connections});
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

//GET /connection/:id/edit: send html for editing connection
exports.edit = (req, res, next)=>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }
    model.findById(id)
    .then(connections=>{
    if(connections) {
        res.render('./connections/edit', {connections})
    } else {
        let err = new Error('Cannot find a connection with id ' + id);
    err.status = 404;
    next(err);
    }
})
    .catch(err=>next(err));
   // res.send('send edit form');
};

//PUT /connections/:id: update connection by id
exports.update =  (req, res, next)=>{
    let connections = req.body;
    let id = req.params.id;
    
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }
    connections.host = req.session.user._id;
    model.findByIdAndUpdate(id, connections, {useFindAndModify: false, runValidators: true})
    .then(connections=>{
        if(connections){
            res.redirect('/connections/');
        } else {
        let err = new Error('Cannot find a connection with id ' + id);
        err.status = 404;
        next(err);
        }
    })
    .catch(err=>{
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('/back');
        }
        
        next(err);
});
        
    
   // res.send('update connection with id' + req.params.id);
};

//DELETE /stories/:id, delete story by id
exports.delete =  (req, res, next)=>{
   let id = req.params.id;

   if(!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error('Invalid story id');
    err.status = 400;
    return next(err);
}

model.findByIdAndDelete(id, {useFindAndModify: false})
.then(connections=>{
    if(connections) {
        res.redirect('/connections');
    } else {
        let err = new Error('Cannot find a connection with id ' + id);
        err.status = 404;
        next(err)
    }
})
};