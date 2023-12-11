const express = require('express');
const app = express();
app.use(express.json());
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(cors());

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.use(session({
  secret: 'tu_secreto',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

const Usuario = require('./models/Usuario.js');

passport.use(new LocalStrategy({
  usernameField: 'correo',
  passwordField: 'contrasenia',
},
(correo, contrasenia, done) => {
  Usuario.findOne({ correo: correo }, (err, usuarioDB) => {
    if (err) {
      return done(err);
    }
    if (!usuarioDB) {
      return done(null, false, { message: 'Usuario o contraseña incorrectos' });
    }
    if (!bcrypt.compareSync(contrasenia, usuarioDB.contrasenia)) {
      return done(null, false, { message: 'Usuario o contraseña incorrectos' });
    }
    return done(null, usuarioDB);
  });
}
));

passport.serializeUser((user, done) => {
done(null, user.id);
});

passport.deserializeUser((id, done) => {
Usuario.findById(id, (err, user) => {
  done(err, user);
});
});

var usuariosRouter = require('./routes/usuarios');
var productosRouter = require('./routes/productos');
var carritosRouter = require('./routes/carritoss.js');
var ticketsRouter = require('./routes/tickets');

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

mongoose.connect(process.env.DB_URI).then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error(error));


app.use('/usuarios', usuariosRouter);
app.use('/productos', productosRouter);
app.use('/carritos', carritosRouter);
app.use('/tickets', ticketsRouter);

app.get('/backend', (req, res) => {
  res.json({ message: 'Datos desde el backend' });
});

app.get('/api/prueba', cors(), (req, res) => {
  console.log('Solicitud recibida en la ruta /api/prueba');
  const datos = { mensaje: "Datos desde el servidor" };
  res.send(datos);
},(error) => {
  console.error('Error al obtener la cadena', error);
  console.error('Detalles del error:', error.message);
  res.status(500).send('Error interno del servidor');
});

console.log(process.env.port)

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log(`Servidor Express en el puerto ${port}`);
});