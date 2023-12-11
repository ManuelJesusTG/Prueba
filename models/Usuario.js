const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
  nombre:  {type:String, required:true},
  correo: {type:String, required:true},
  contrasenia: {type:String, required:true},
  direccion: String,
  numero: String,
  rol: {type: String, default:"Estandar"}
});

// Crear el modelo
const Usuario = mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;