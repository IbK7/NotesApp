const mongoose = require('mongoose');

const notesSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    noteTitle:{
        type: String,
        required: true,
    },
    noteContent:{
        type: String,
        required: false,
    }
})

const Note = mongoose.model("Note", notesSchema);

module.exports = Note;