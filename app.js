const express = require("express");
const app = express();
const conectDB = require("./src/database");
const PORT = process.env.PORT ?? 3000;
const morgan = require("morgan");
const Granja = require("./src/product");
const mongoose = require('mongoose');

//conectar a la base de datos

conectDB();

//middleware
app.use(express.json());
app.use(morgan("dev"));

//ruta principal
app.get('/', (req, res) => {res.json("BIenvenido a la ruta principal");

})

//obtener todos los prductos
app.get('/granjas', async (req, res) => {
  try {
    const granjas = await Granja.find({});
    res.json(granjas);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en la obtención de productos');
  }
});

//obtener un producto por ID
app.get('/granja/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID no válido' });
  }

  try {
    const producto = await Granja.findById(id);
    if (!producto) return res.status(404).json('producto no encontrado');
    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json('Error en la obtención de los productos');
  }
});

//filtrar productos por nombre
app.get('/granjas/busqueda/:nombre', async (req, res) => {
  const { nombre } = req.params;
console.log("nombre a imprimir " + nombre);
  try {
    const productos = await Granja.find({ "nombre": { $regex: nombre, $options: "i" } });
    if (productos.length === 0) return res.status(404).json('No hay productos con ese nombre');
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json('Error en la búsqueda de productos');
  }
});

//agregar un producto
app.post('/granjas', async (req, res) => {
  const newProduct = new Granja(req.body);
  try {
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch {
    res.status(500).json({mensjae: 'error al agregar el producto'});
  }
});

//modificar un producto
app.patch('/granjas/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID no válido' });
  }
  try {
    const granja = await Granja.findByIdAndUpdate(id, req.body, { new: true });
    if (!granja) return res.status(404).json('Producto no encontrado');
    res.status(201).json({ mensaje: "producto actializado", granja});
  } catch (error) {
    res.status(500).json({mensaje: 'Error al modificar el producto'});
  }
});

//eliminar un producto
app.delete('/granjas/:id', async (req, res) => {
  const {id} = req.params
  try {
    const producto = await Granja.findByIdAndDelete(id);
    if (!producto) return res.status(404).json('Producto no encontrado');
    res.json({mensaje: 'Producto eliminado'});
  } catch (error) {
    res.status(500).json({mensjae: 'Error al eliminar el producto'});
  }
});

//manejo de errores en la estructura de las solicitudes y respuestas
app.use((err, req, res, next) => {
 res.status(500).json({ mensaje: 'error en el servidor'});
});

//control de acceso a rutas no existentes con respuestas apropiadas
app.use((req, res) => {
res.status(404).json({ mensaje: 'ruta no encontrada'});
});

//iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:3000`);
});