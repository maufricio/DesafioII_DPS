const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataIngresos = new Schema({
    Tipo_ingreso:{
        type: String,
        required : true
    },
    Monto:{
        type: Number,
        required : true
    }
},{ timestamps: true });

module.exports = mongoose.model('Ingresos', dataIngresos, 'Ingresos');
