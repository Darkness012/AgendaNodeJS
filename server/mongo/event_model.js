const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EventSchema = new Schema({
    title: { type: String, required: true},
    start: { type: String, required: true },
    allDay: { type:Boolean, required: true },
    end: { type: String, required: false},
    user_email: { type: String, required: true }
  })
  

let EventModel = mongoose.model('eventos', EventSchema)

module.exports = EventModel
