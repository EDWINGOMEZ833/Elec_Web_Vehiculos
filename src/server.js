const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./db');
const bcrypt = require('bcrypt');
const multer = require('multer');
const app = express();
const port = 3000;

// Configurar multer para subir imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Generar un nombre único para la imagen
    }
});
const upload = multer({ storage });

// Configurar middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public'))); // Sirviendo archivos estáticos
app.use('/css', express.static(path.join(__dirname, '..', 'css')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Sirviendo las imágenes subidas
app.use(express.static(path.join(__dirname, 'public')));

// Página de registro
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'registro.html'));
});

// Endpoint para el registro de usuario
app.post('/register', async (req, res) => {
    const { nombre, tipo_documento, numero_documento, correo, nombre_usuario, contrasena, tipo_usuario } = req.body;

    if (!nombre || !tipo_documento || !numero_documento || !correo || !nombre_usuario || !contrasena || !tipo_usuario) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    try {
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        const query = 'INSERT INTO usuarios (nombre, tipo_documento, numero_documento, correo, nombre_usuario, contrasena, tipo_usuario) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [nombre, tipo_documento, numero_documento, correo, nombre_usuario, hashedPassword, tipo_usuario], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Usuario registrado exitosamente' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

// Endpoint para el login
app.post('/login', (req, res) => {
    const { nombre_usuario, contrasena } = req.body;

    const query = 'SELECT * FROM usuarios WHERE nombre_usuario = ?';
    db.query(query, [nombre_usuario], async (err, result) => {
        if (err) return res.status(500).json({ error: 'Error en el servidor' });
        if (result.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

        const usuario = result[0];

        // Verificar la contraseña
        const validPassword = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!validPassword) return res.status(400).json({ error: 'Contraseña incorrecta' });

        // Retornar el tipo de usuario junto con el mensaje de éxito
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            tipo_usuario: usuario.tipo_usuario,
            usuario: {
                nombre_usuario: usuario.nombre_usuario,
                // Agrega otros campos que quieras incluir
            }
        });
    });
});


// Endpoint para obtener el catálogo (solo para administradores)
app.get('/admin-catalogo', (req, res) => {
    const query = 'SELECT * FROM catalogo';
    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(result);
    });
});

// Endpoint para obtener un vehículo por su ID
app.get('/admin-catalogo/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM catalogo WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length === 0) return res.status(404).json({ error: 'Vehículo no encontrado' });
        res.status(200).json(result[0]);
    });
});

// Endpoint para agregar un nuevo vehículo al catálogo
app.post('/admin-catalogo', upload.single('imagen'), (req, res) => {
    const { titulo, precio, color } = req.body;
    const imagen = req.file ? `/public/uploads/${req.file.filename}` : null;

    if (!titulo || !precio || !color || !imagen) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const query = 'INSERT INTO catalogo (titulo, precio, color, imagen) VALUES (?, ?, ?, ?)';
    db.query(query, [titulo, precio, color, imagen], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Vehículo agregado exitosamente' });
    });
});

// Endpoint para actualizar un vehículo existente en el catálogo
app.put('/admin-catalogo/:id', upload.single('imagen'), (req, res) => {
    const { id } = req.params;
    const { titulo, precio, color } = req.body;

    // Consulta para obtener el vehículo existente
    const querySelect = 'SELECT imagen FROM catalogo WHERE id = ?';
    
    db.query(querySelect, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (result.length === 0) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        // Obtener la imagen actual
        const imagenActual = result[0].imagen;
        const nuevaImagen = req.file ? `/uploads/${req.file.filename}` : imagenActual;

        // Consulta para actualizar el vehículo
        let queryUpdate = 'UPDATE catalogo SET titulo = ?, precio = ?, color = ?, imagen = ? WHERE id = ?';
        const params = [titulo, precio, color, nuevaImagen, id];

        db.query(queryUpdate, params, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(200).json({ message: 'Vehículo actualizado exitosamente' });
        });
    });
});


// Endpoint para eliminar un vehículo del catálogo
app.delete('/admin-catalogo/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM catalogo WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Vehículo eliminado exitosamente' });
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
