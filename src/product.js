const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  codigo: {
    type: Number,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
});

const Granja = mongoose.model('Granja', ProductoSchema);

module.exports = Granja