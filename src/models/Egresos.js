const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataEgresos = new Schema({
    Tipo_egreso:{
        type: String,
        required : true
    },
    Monto:{
        type: Number,
        required : true
    }
},{ timestamps: true });

module.exports = mongoose.model('Egresos', dataEgresos, 'Egresos');
