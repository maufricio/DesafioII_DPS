const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSolicitud = new Schema({
    ID_notification: {
        type: String,
        required: true
    },
    Nombre_producto: {
        type: String,
        required: true
    },
    Direccion: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Solicitud', dataSolicitud, 'Solicitud');