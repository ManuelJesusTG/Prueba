const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Usuario = require('../models/Usuario.js');
var Producto = require('../models/Producto.js');

const TicketSchema = new Schema({
  UsuarioID: {
    type: Schema.ObjectId,
    ref: 'Usuario'
  },
  Productos: [{
    type: Schema.ObjectId,
    ref: 'Producto'
  }],
  precio: Number,
  DatosPago: String,
  MetodoPago: String,
  fechaVenta: { type: Date, default: Date.now }
});

// Crear el modelo
const Ticket = mongoose.model('Ticket', TicketSchema);

module.exports = Ticket;