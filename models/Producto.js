const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductoSchema = new Schema({
  nombre:  String,
  descripcion: String,
  precio: Number,
  stock: Number,
  stock_status: String,
  categoria: String,
  marca: String,
  talla: {
    type: String,
    enum: ['XS','S', 'M','L','XL'],
    default: 'M'
},
  color: String,
  imagen: String
});

// Crear el modelo
const Producto = mongoose.model('Producto', ProductoSchema);

module.exports = Producto;