const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const ejs = require('ejs');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let productos = [];

app.get('/tienda', (req, res) => {
  const productosDefinidos = productos || [];
  res.render('tienda', { productos: productosDefinidos });
});

app.get('/admin', (req, res) => {
  res.render('admin', { productos });
});

app.post('/agregar-producto', upload.single('imagen'), (req, res) => {
  const { nombre, precio, categoria, descripcion } = req.body;
  const imagen = req.file ? req.file.buffer : null;

  const nuevoProducto = {
    id: productos.length + 1, // Puedes ajustar la lógica para asignar IDs
    nombre,
    precio,
    categoria,
    descripcion,
    imagen,
  };

  productos.push(nuevoProducto);
  res.redirect('/admin');
});

app.get('/editar-producto/:id', (req, res) => {
  const idProducto = parseInt(req.params.id);
  const producto = productos.find((p) => p.id === idProducto);

  if (!producto) {
    return res.status(404).send('Producto no encontrado');
  }

  res.render('editar-producto', { producto });
});

app.post('/editar-producto/:id', upload.single('imagen'), (req, res) => {
  const idProducto = parseInt(req.params.id);
  const productoIndex = productos.findIndex((p) => p.id === idProducto);

  if (productoIndex === -1) {
    return res.status(404).send('Producto no encontrado');
  }

  const { nombre, precio, categoria, descripcion } = req.body;
  const imagen = req.file ? req.file.buffer : productos[productoIndex].imagen;

  productos[productoIndex] = {
    ...productos[productoIndex],
    nombre,
    precio,
    categoria,
    descripcion,
    imagen,
  };

  res.redirect('/admin');
});

app.get('/eliminar-producto/:id', (req, res) => {
  const idProducto = parseInt(req.params.id);
  productos = productos.filter((p) => p.id !== idProducto);
  res.redirect('/admin');
});

app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});
