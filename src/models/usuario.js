const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataUsuario = new Schema({
    Nombre:{
        type: String,
        required : true
    },
    Foto_carnet:{
        type: String,
        required : true
    },
    Foto_rostro:{
        type: String,
        required: true
    },
    Direccion:{
        type: String,
        required: true
    },
    Telefono:{
        type: String,
        required: true
    }
},{ timestamps: true });

module.exports = mongoose.model('Usuario', dataUsuario, 'Usuario');