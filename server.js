const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Para analizar las solicitudes JSON
app.use(bodyParser.urlencoded({ extended: true })); // Para analizar las solicitudes URL-encoded

// Conexión a MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'guardias'
});

connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});

// Rutas
app.post('/api/login', (req, res) => {
    const { rut, contrasena } = req.body;

    const query = 'SELECT guardia.rut, guardia.contrasena, tipo_usuario.id_tipo_usuario FROM guardia INNER JOIN tipo_usuario on guardia.tipo_guardia = tipo_usuario.id_tipo_usuario WHERE rut = ? AND contrasena = ?';
    connection.query(query, [rut, contrasena], (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).send('Error al realizar la consulta');
            return;
        }

        if (results.length === 0) {
            res.status(401).send('Credenciales incorrectas');
            return;
        }
        res.json(results[0]);
    });
});

//obtener todos los guardias
app.get('/api/guardias', (req, res) => {
    const query = 'SELECT guardia.rut, guardia.nombre, guardia.apellido, guardia.telefono, guardia.correo, guardia.contrasena FROM guardia Where tipo_guardia = 2 AND estado = 1';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).send('Error al realizar la consulta');
            return;
        }

        res.json(results);
    });
});

//obtener datos por rut para editar
app.get('/api/guardias_rut/:rut', (req, res) => {
    const { rut } = req.params;
    const query = 'SELECT guardia.rut, guardia.nombre, guardia.apellido, guardia.telefono, guardia.correo, guardia.contrasena FROM guardia WHERE rut = ?';
    connection.query(query, [rut], (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).send('Error al realizar la consulta');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('Guardia no encontrado');
            return;
        }
        res.json(results[0]);
    });
});

//eliminar guardias 
app.put('/api/deleteguardias/:rut', (req, res) => {
    const { rut } = req.params;
    const query = 'UPDATE guardia SET estado = 0 WHERE rut = ? AND estado = 1';
    connection.query(query, [rut], (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).send('Error al realizar la consulta');
            return;
        }
        res.json(results);
    });
});


//agregar guardias
app.post('/api/addguardias', (req, res) => {
    const { rut, nombre, apellido, telefono, correo, contrasena, tipo_guardia } = req.body;
    const query = 'INSERT INTO guardia (rut, nombre, apellido, telefono, correo, contrasena,estado, tipo_guardia) VALUES (?, ?, ?, ?, ?, ?, 1, 2)';
    connection.query(query, [rut, nombre, apellido, telefono, correo, contrasena, tipo_guardia], (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).send('Error al realizar la consulta');
            return;
        }
        res.json(results);
    });
});


// Editar guardias
app.put('/api/editguardias/:rut', (req, res) => {
    const { rut } = req.params;
    const { nombre, apellido, telefono, correo, contrasena } = req.body;

    // Construir la consulta SQL para la actualización, omitiendo la contraseña si está vacía
    let query = 'UPDATE guardia SET nombre = ?, apellido = ?, telefono = ?, correo = ?';
    const queryParams = [nombre, apellido, telefono, correo];

    // Si la contraseña no está vacía, añadir la actualización de la contraseña a la consulta
    if (contrasena) {
        query += ', contrasena = ?';
        queryParams.push(contrasena);
    }

    query += ' WHERE rut = ?';
    queryParams.push(rut);

    // Ejecutar la consulta SQL
    connection.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).send('Error al realizar la consulta');
            return;
        }
        res.json(results);
    });
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
