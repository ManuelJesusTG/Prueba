const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Usuario = require('../models/Usuario.js');
var Producto = require('../models/Producto.js');

const CarritoSchema = new Schema({
  UsuarioID: {
    type: Schema.ObjectId,
    ref: 'Usuario'
    },
  Productos: [{
    type: Schema.ObjectId,
    ref: 'Producto'
  }],
  precio: Number,
  fechaCreacion: { type: Date, default: Date.now }
});

// Crear el modelo
const Carrito = mongoose.model('Carrito', CarritoSchema);

module.exports = Carrito;