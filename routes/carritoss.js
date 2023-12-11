var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Carrito = require('../models/Carrito.js');
var Producto = require('../models/Producto.js');

// GET de todos los Carritos
router.get('/:id', function (req, res, next) {
  Carrito.find().exec(function (err, Carritoinfo) {
    if (err) res.status(500).send(err);
    else res.status(200).json(Carritoinfo);
  });
});


// POST del carrito

router.post('/agregar-al-carrito', async (req, res) => {
  try {
    const usuarioId = req.body.usuarioId;
    const productoId = req.body.productoId;

    let carrito = await Carrito.findOne({ UsuarioID: usuarioId }).populate('Productos');
    if (!carrito) {
      carrito = new Carrito({ UsuarioID: usuarioId, Productos: [], precio: 0 });
      await carrito.save();
    }

    const nuevoProducto = await Producto.findById(productoId);
    if (!nuevoProducto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    carrito.Productos.push(nuevoProducto);

    carrito.precio = carrito.Productos.reduce((total, producto) => total + producto.precio, 0);

    await carrito.save();

    res.status(200).json({ mensaje: 'Producto agregado al carrito con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al agregar el producto al carrito' });
  }
});

// GET para obtener el carrito de un usuario en especifico con sus productos

router.get('/api/productos/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const carrito = await Carrito.findOne({ UsuarioID: userId }).populate('Productos').exec();

    if (carrito) {
      const productos = carrito.Productos;

      res.json(productos);
    } else {
      res.json([]); // Devolver un array vacío si el carrito no existe
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos del carrito' });
  }
});

// DELETE del producto del carrito 

router.delete('/:usuarioId/eliminar/:productoId', async (req, res) => {
  try {
    const { usuarioId, productoId } = req.params;

    const carrito = await Carrito.findOne({ UsuarioID: usuarioId }).populate('Productos');
    
    if (!carrito) {
      return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    }

    carrito.Productos = carrito.Productos.filter(producto => producto._id.toString() !== productoId);

    carrito.precio = carrito.Productos.reduce((total, producto) => total + producto.precio, 0);

    await carrito.save();

    res.status(200).json({ mensaje: 'Producto eliminado del carrito con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al eliminar el producto del carrito' });
  }
});


// DELETE de un carrito

router.delete('/:usuarioID', async (req, res) => {
  const usuarioID = req.params.usuarioID;

  console.log(usuarioID);

  try {
    
    await Carrito.findOneAndDelete({ UsuarioID: usuarioID });

    res.json({ ok: true, message: 'Carrito eliminado exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: 'Error al eliminar el carrito.' });
  }
});
module.exports = router;