var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Producto = require('../models/Producto.js');
var db = mongoose.connection;
const multer = require('multer');
const path = require('path');

// GET de todos los Productos

router.get('/', function(req, res, next) {
  Producto.find().exec(function(err, productos) {
    if (err) {
      res.status(500).send(err);
    } else {
      // Mapear los productos para incluir la ruta de la imagen
      const productosConImagenes = productos.map(producto => {
        return {
          _id: producto._id,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          stock: producto.stock,
          categoria: producto.categoria,
          stock_status: producto.stock_status,
          marca: producto.marca,
          talla: producto.talla,
          imagen: `http://localhost:3000/productos/obtener-imagen/${producto.imagen}` // Ruta completa de la imagen
        };
      });

      res.status(200).json(productosConImagenes);
    }
  });
});

// POST productos

// Subida de imagenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './imagenes/productos');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/subir-imagen-producto', upload.single('imagen'), async (req, res) => {
  try {
    const nuevoProducto = new Producto({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      stock: req.body.stock,
      categoria: req.body.categoria,
      stock_status: req.body.stock_status,
      marca: req.body.marca,
      talla: req.body.talla,
      imagen: req.file.path,
    });

    await nuevoProducto.save();

    res.json({ mensaje: 'Producto subido exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al subir el producto' });
  }
});

// Codigo para obtener la imagen del producto que hemos subido

const rutaImagenes = path.join(__dirname,'..', 'imagenes', 'productos');
router.use('/imagenes/productos', express.static(rutaImagenes));

router.get('/obtener-imagen/imagenes/productos/:nombreImagen', (req, res) => {
  const nombreImagen = req.params.nombreImagen;
  const rutaImagen = path.join(rutaImagenes, nombreImagen);

  // Envía la imagen como respuesta
  res.sendFile(rutaImagen);
});

// get de 1 solo producto

router.get('/:id', function(req, res, next) {
  const productoId = req.params.id;

  Producto.findById(productoId, function(err, producto) {
    if (err) {
      res.status(500).send(err);
    } else if (!producto) {
      res.status(404).send('Producto no encontrado');
    } else {
      const productoConImagen = {
        _id: producto._id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        categoria: producto.categoria,
        stock_status: producto.stock_status,
        marca: producto.marca,
        talla: producto.talla,
        imagen: `http://localhost:3000/productos/obtener-imagen/${producto.imagen}` // Ruta completa de la imagen
      };

      res.status(200).json(productoConImagen);
    }
  });
});


module.exports = router;
