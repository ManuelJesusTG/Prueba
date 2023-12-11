var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var mongoose = require('mongoose');
var Usuario = require('../models/Usuario.js');
var db = mongoose.connection;

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


router.get('/', function(req, res, next) {
    res.send("usuario")
  });

  // GET de todos los usuarios

  router.get('/a', function(req,res,next){
    Usuario.find().exec(function(err,usuarioinfo) {
        if (err) res.status(500).send(err);
        else res.status(200).json(usuarioinfo);
    })
})

// GET de un usuario

router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const usuario = await Usuario.findById(userId);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error('Error al obtener el usuario por ID:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Post de los usuarios (Registro)

router.post('/register', function(req, res, next) {

    const { nombre, correo, contrasenia, direccion, numero } = req.body;

    console.log(nombre, correo, contrasenia, direccion, numero);

    let usuario = new Usuario({
        nombre,
        correo,
        contrasenia: bcrypt.hashSync(contrasenia, 10),
        direccion,
        numero
      });

      usuario.save((err, usuarioDB) => {
        if (err) {
          return res.status(400).json({
             ok: false,
             err,
          });
        }
        res.json({
              ok: true,
              usuario: usuarioDB
           });
        })
    });

// Apartado de login / autentificación


router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Error de autenticación' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Si llegas aquí, la autenticación fue exitosa y el usuario está logueado :D
    // Generamos el token para probar
    const token = jwt.sign({ usuario: { _id: user._id, correo: user.correo }}, 'tu_secreto_secreto', { expiresIn: '1h' });

    res.status(200).json({ message: 'Autenticación exitosa', token, userId: user._id });
  })(req, res, next);
});


router.put('/actualizar-usuario/:id', async (req, res, next) => {
  

    const { id } = req.params;
    const nuevosDatosUsuario = req.body;

    try {
      if (nuevosDatosUsuario.contrasenia) {

        const hashedPassword = await bcrypt.hash(nuevosDatosUsuario.contrasenia, 10);
        nuevosDatosUsuario.contrasenia = hashedPassword;
      }

      const usuarioActualizado = await Usuario.findByIdAndUpdate(id, nuevosDatosUsuario, { new: true });

      if (!usuarioActualizado) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.status(200).json({ message: 'Usuario actualizado correctamente', usuario: usuarioActualizado });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
  (req, res, next);
});

module.exports = router;
