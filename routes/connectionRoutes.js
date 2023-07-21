const express = require('express');
const controller = require('../controllers/connectionController');
const {isLoggedIn, isHost} = require('../middlewares/auth');
const{validateId, validateConnection} = require('../middlewares/validator');

const router = express.Router();

//GET /connections- send all connections for the user.
router.get('/', controller.connections);

//GET /connections/newConnection

router.get('/newConnection', isLoggedIn, controller.newConnections);


//POST /connection create new connection

router.post('/', isLoggedIn, controller.create);


//GET /connections/connection-show details by id
router.get('/connection/:id', validateId, validateConnection, controller.show);

//GET /connection/:id/edit: send html for editing connection
router.get('/:id/edit', validateId, validateConnection, isLoggedIn, isHost, controller.edit);

//PUT /connections/:id: update connection by id
router.put('/:id', validateId, validateConnection, isLoggedIn, isHost, controller.update);

//DELETE /stories/:id, delete story by id
router.delete('/:id', validateId, validateConnection, isLoggedIn, isHost, controller.delete);

module.exports = router;