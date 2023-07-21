const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
        name: {type: String, required: [true, 'name is required']},
        topic: {type: String, required: [true, 'topic is required']},
        details: {type: String, required: [true, 'details are required'], minLength: [10, 'the details should have atleast 10 characters']},
        date: {type: Date, required: [true, 'date is required']},
        startTime: {type: String, required: [true, 'start time is required']},
        endTime: {type: String, required: [true, 'end time is required']},
        host: {type: Schema.Types.ObjectId, ref: 'User'},
        where: {type: String, required: [true, 'location is required']},
        eventImage: {type: String, required: [true, 'image url is required']}
},
{timestamps: true}

);


module.exports = mongoose.model('Connections', connectionSchema);






