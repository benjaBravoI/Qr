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
    database: 'qr'
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
    const { rut, clave } = req.body;

    // Consulta para verificar las credenciales del usuario
    const queryUsuario = 'SELECT * FROM usuario WHERE rut = ? AND clave = ?';
    connection.query(queryUsuario, [rut, clave], (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).send('teError al realizar la consulta');
            return;
        }

        if (results.length === 0) {
            res.status(401).send('Credenciales incorrectas');
            return;
        }

        // Obtener información del usuario
        const usuario = results[0];

        // Consulta para verificar si el usuario es administrador
        const queryAdmin = 'SELECT * FROM admin WHERE rut_adm = ?';
        connection.query(queryAdmin, [rut], (err, resultsAdmin) => {
            if (err) {
                console.error('Error al realizar la consulta de administrador:', err);
                res.status(500).send('Error al realizar la consulta');
                return;
            }

            if (resultsAdmin.length > 0) {
                // El usuario es administrador
                res.json({ ...usuario, role: 'admin' });
                return;
            }

            // Consulta para verificar si el usuario es guardia
            const queryGuardia = 'SELECT * FROM guardia WHERE rut_g = ?';
            connection.query(queryGuardia, [rut], (err, resultsGuardia) => {
                if (err) {
                    console.error('Error al realizar la consulta de guardia:', err);
                    res.status(500).send('Error al realizar la consulta');
                    return;
                }

                if (resultsGuardia.length > 0) {
                    // El usuario es guardia
                    res.json({ ...usuario, role: 'guardia' });
                } else {
                    // El usuario no es ni administrador ni guardia
                    res.status(401).send('Credenciales incorrectas');
                }
            });
        });
    });
});

//GUARDIAS

//obtener todos los guardias
app.get('/api/guardias', (req, res) => {
    const query = 'SELECT usuario.rut, usuario.nombre, usuario.apellido, usuario.fono, usuario.correo, usuario.clave FROM usuario Inner join guardia  on guardia.rut_g = usuario.rut Where  estado = 1';
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
    const query = 'SELECT usuario.rut, usuario.nombre, usuario.apellido, usuario.fono, usuario.correo, usuario.clave FROM usuario Inner join guardia  on guardia.rut_g = usuario.rut WHERE rut = ?';
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
    const query = 'UPDATE usuario SET estado = 0 WHERE rut = ? AND estado = 1';
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
    const { rut, nombre, apellido, fono, correo, clave } = req.body;

    // Iniciar una transacción
    connection.beginTransaction((err) => {
        if (err) {
            console.error('Error al iniciar la transacción:', err);
            res.status(500).send('Error al iniciar la transacción');
            return;
        }

        // Primero insertar en la tabla usuario
        const insertUsuarioQuery = 'INSERT INTO usuario (rut, nombre, apellido, fono, correo, estado, clave) VALUES (?, ?, ?, ?, ?, 1, ?)';
        connection.query(insertUsuarioQuery, [rut, nombre, apellido, fono, correo, clave], (err, usuarioResult) => {
            if (err) {
                connection.rollback(() => {
                    console.error('Error al insertar en tabla usuario:', err);
                    res.status(500).send('Error al insertar en tabla usuario');
                });
                return;
            }

            // Luego insertar en la tabla guardia con inicio = 1
            const insertGuardiaQuery = 'INSERT INTO guardia (rut_g, inicio) VALUES (?, 1)';
            connection.query(insertGuardiaQuery, [rut], (err, guardiaResult) => {
                if (err) {
                    connection.rollback(() => {
                        console.error('Error al insertar en tabla guardia:', err);
                        res.status(500).send('Error al insertar en tabla guardia');
                    });
                    return;
                }

                // Commit si todo está bien
                connection.commit((err) => {
                    if (err) {
                        connection.rollback(() => {
                            console.error('Error al hacer commit:', err);
                            res.status(500).send('Error al hacer commit');
                        });
                        return;
                    }
                    
                    // Si todo ha ido bien, enviar respuesta JSON
                    res.json({
                        usuario: usuarioResult,
                        guardia: guardiaResult
                    });
                });
            });
        });
    });
});


// Actualizar guardia
app.put('/api/editguardias/:rut', (req, res) => {
    const { rut } = req.params;
    const { nombre, apellido, fono, correo, clave } = req.body;

    let updateQuery = 'UPDATE usuario SET nombre = ?, apellido = ?, fono = ?, correo = ?';
    const params = [nombre, apellido, fono, correo];

    if (clave) {
        updateQuery += ', clave = ?';
        params.push(clave);
    }

    updateQuery += ' WHERE rut = ?';
    params.push(rut);

    connection.query(updateQuery, params, (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).send('Error al realizar la consulta');
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).send('Guardia no encontrado');
            return;
        }

        res.json({ message: 'Guardia actualizado correctamente' });
    });
});

//ESTACIONAMIENTOS

//obtener todos los estacionamientos
app.get('/api/estacionamientos', (req, res) => {
    const query = 'SELECT estacionamiento.id_es, estacionamiento.ubicacion, estacionamiento.capacidad FROM estacionamiento where estado = 1';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).send('Error al realizar la consulta');
            return;
        }
        res.json(results);
    });
});

//obtener datos por id para editar
app.get('/api/estacionamientosID/:id_es', (req, res) => {
    const { id_es } = req.params;
    const query = 'SELECT estacionamiento.id_es, estacionamiento.ubicacion, estacionamiento.capacidad FROM estacionamiento WHERE id_es = ?';
    connection.query(query, [id_es], (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).send('Error al realizar la consulta');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('Estacionamiento no encontrado');
            return;
        }
        res.json(results[0]);
    });
});

//eliminar estacionamientos
app.put('/api/delete_es/:id_es', (req, res) => {
    const { id_es } = req.params;
    const query = 'UPDATE estacionamiento SET estado = 0 WHERE id_es = ? AND estado = 1'; // Cambiar estado a 0
    connection.query(query, [id_es], (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).send('Error al realizar la consulta');
            return;
        }
        res.json(results);
    });
});



//agregar estacionamientos
app.post('/api/addestacionamientos', (req, res) => {
    const { ubicacion, capacidad } = req.body;
    const query = 'INSERT INTO estacionamiento (ubicacion, capacidad, estado) VALUES (?, ?, 1)';
    connection.query(query, [ubicacion, capacidad], (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).send('Error al realizar la consulta');
            return;
        }
        res.json(results);
    });
});

// Actualizar estacionamiento

app.put('/api/editestacionamientos/:id_es', (req, res) => {
    const { id_es } = req.params;
    const { ubicacion, capacidad } = req.body;
    const query = 'UPDATE estacionamiento SET ubicacion = ?, capacidad = ? WHERE id_es = ?';
    connection.query(query, [ubicacion, capacidad, id_es], (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).send('Error al realizar la consulta');
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).send('Estacionamiento no encontrado');
            return;
        }

        res.json({ message: 'Estacionamiento actualizado correctamente' });
    });
});


//SIMULAR INGRESO Y EGRESO DE VEHICULO A ESTACIONAMIENTO
//verificar rut de funcionario, estudiante
app.get('/api/verificar_rut/:rut', (req, res) => {
    const { rut } = req.params;
    const query = 'SELECT usuario.rut, usuario.nombre, usuario.apellido FROM usuario INNER JOIN estudiante ON usuario.rut = estudiante.rut_e WHERE usuario.rut = ? AND usuario.estado = 1';
  
    console.log(`Consulta SQL: ${query}, Parámetros: ${rut}`); // Añadir depuración aquí
  
    connection.query(query, [rut], (err, results) => {
      if (err) {
        console.error('Error al realizar la consulta:', err);
        res.status(500).send('Error al realizar la consulta');
        return;
      }
  
      console.log('Resultados de la consulta:', results); // Añadir depuración aquí
  
      if (results.length === 0) {
        res.status(404).send({ existencia: false, mensaje: 'Usuario no encontrado' });
      } else {
        res.json({ existencia: true });
      }
    });
  });


// Crear un nuevo registro de ingreso/egreso

app.post('/api/ingreso_egreso', (req, res) => {
    const { rut_e, rut_g, id_es, estado } = req.body;
    const fecha = new Date().toISOString().split('T')[0];
    const hora = new Date().toLocaleTimeString();

    // Consultar el último registro de ingreso activo para el RUT
    const querySelect = 'SELECT * FROM ingreso_egreso WHERE rut_e = ? ORDER BY fecha DESC, hora DESC LIMIT 1';
    const queryInsert = 'INSERT INTO ingreso_egreso (rut_e, rut_g, fecha, hora, estado, id_es) VALUES (?, ?, ?, ?, ?, ?)';
    const queryUpdate = 'UPDATE ingreso_egreso SET estado = 0 WHERE id_ie = ?';

    connection.beginTransaction(err => {
        if (err) {
            console.error('Error al iniciar la transacción:', err);
            return res.status(500).send('Error al iniciar la transacción');
        }

        connection.query(querySelect, [rut_e], (err, results) => {
            if (err) {
                console.error('Error al consultar el último registro de ingreso:', err);
                return connection.rollback(() => {
                    res.status(500).send('Error al consultar el último registro de ingreso');
                });
            }

            if (results.length > 0 && results[0].estado === 1) {
                // Hay un registro de ingreso activo, insertar salida
                const id_ie = results[0].id_ie;

                connection.query(queryInsert, [rut_e, rut_g, fecha, hora, 0, id_es], (err, results) => {
                    if (err) {
                        console.error('Error al insertar el registro de salida:', err);
                        return connection.rollback(() => {
                            res.status(500).send('Error al insertar el registro de salida');
                        });
                    }

                    connection.query(queryUpdate, [id_ie], (err, results) => {
                        if (err) {
                            console.error('Error al actualizar el registro de ingreso:', err);
                            return connection.rollback(() => {
                                res.status(500).send('Error al actualizar el registro de ingreso');
                            });
                        }

                        connection.commit(err => {
                            if (err) {
                                console.error('Error al realizar commit:', err);
                                return connection.rollback(() => {
                                    res.status(500).send('Error al realizar commit');
                                });
                            }

                            res.send('Registro de salida realizado correctamente');
                        });
                    });
                });
            } else {
                // No hay registro de ingreso activo, crear uno nuevo como entrada
                connection.query(queryInsert, [rut_e, rut_g, fecha, hora, estado, id_es], (err, results) => {
                    if (err) {
                        console.error('Error al insertar el nuevo registro de ingreso:', err);
                        return connection.rollback(() => {
                            res.status(500).send('Error al insertar el nuevo registro de ingreso');
                        });
                    }

                    connection.commit(err => {
                        if (err) {
                            console.error('Error al realizar commit:', err);
                            return connection.rollback(() => {
                                res.status(500).send('Error al realizar commit');
                            });
                        }

                        res.send('Registro de ingreso realizado correctamente');
                    });
                });
            }
        });
    });
});

// Obtener el ultimo registro de ingreso-egreso de un usuario por su rut
app.get('/api/ultimo_registro/:rut_e', (req, res) => {
    const { rut_e } = req.params;
    const query = 'SELECT * FROM ingreso_egreso WHERE rut_e = ? ORDER BY id_ie DESC LIMIT 1';
    connection.query(query, [rut_e], (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).send('Error al realizar la consulta');
            return;
        }

        if (results.length === 0) {
            res.status(404).send('Registro no encontrado');
            return;
        }
        res.json(results[0]);
    });
});

//obtener estacionamientos dropdown
app.get('/api/estacionamientosDropdown', (req, res) => {
    const query = 'SELECT estacionamiento.id_es, estacionamiento.ubicacion FROM estacionamiento where estado = 1';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).send('Error al realizar la consulta');
            return;
        }
        res.json(results);
    });
});


// Métricas
// Obtener la cantidad de vehiculos estacionados en un estacionamiento
app.get('/api/disponibilidad/:id_es', (req, res) => {
    const { id_es } = req.params;
    const query = 'SELECT COUNT(*) AS cantidad FROM ingreso_egreso WHERE id_es = ? AND estado = 1';
    connection.query(query, [id_es], (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).send('Error al realizar la consulta');
            return;
        }
        res.json(results[0]);
    });
});

app.get('/api/capacidad/:id_es', (req, res) => {
    const { id_es } = req.params;
    const query = 'SELECT capacidad FROM estacionamiento WHERE id_es = ?';
    connection.query(query, id_es, (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).send('Error al realizar la consulta');
            return;
        }
        res.json(results[0]); // Devolver el primer resultado, asumiendo que solo debería haber uno por id_es
    });
});

// Obtener la cantidad de ingresos por hora
app.get('/api/metricas/hora', (req, res) => {
    const { inicio, fin } = req.query;
    const query = `
        SELECT CONCAT(HOUR(hora), ':00-', HOUR(hora), ':59') AS intervalo, COUNT(*) AS total_ingresos 
        FROM ingreso_egreso 
        WHERE fecha BETWEEN ? AND ? 
        AND estado = 1 
        GROUP BY HOUR(hora)
    `;
    console.log(`Ejecutando consulta con inicio: ${inicio}, fin: ${fin}`);
    connection.query(query, [inicio, fin], (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta:', err);
            res.status(500).send('Error al realizar la consulta');
            return;
        }
        console.log('Consulta realizada correctamente. Resultados:', results);
        res.json(results);
    });
});

// Obtener la cantidad de ingresos por día
app.get('/api/metricas/dia', (req, res) => {
    const { inicio, fin } = req.query;
    const query = `
        SELECT DATE_FORMAT(fecha, '%Y-%m-%d') AS intervalo, COUNT(*) AS total_ingresos 
        FROM ingreso_egreso 
        WHERE fecha BETWEEN ? AND ? 
        AND estado = 1 
        GROUP BY DATE_FORMAT(fecha, '%Y-%m-%d')
    `;
    console.log(`Ejecutando consulta por día con inicio: ${inicio}, fin: ${fin}`);
    connection.query(query, [inicio, fin], (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta por día:', err);
            res.status(500).send('Error al realizar la consulta');
            return;
        }
        console.log('Consulta por día realizada correctamente. Resultados:', results);
        res.json(results);
    });
});

// Obtener la cantidad de ingresos por semana
app.get('/api/metricas/semana', (req, res) => {
    const { inicio, fin } = req.query;
    const query = `
        SELECT CONCAT(YEAR(fecha), '-', WEEK(fecha)) AS intervalo, COUNT(*) AS total_ingresos 
        FROM ingreso_egreso 
        WHERE fecha BETWEEN ? AND ? 
        AND estado = 1 
        GROUP BY YEAR(fecha), WEEK(fecha)
    `;
    console.log(`Ejecutando consulta por semana con inicio: ${inicio}, fin: ${fin}`);
    connection.query(query, [inicio, fin], (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta por semana:', err);
            res.status(500).send('Error al realizar la consulta');
            return;
        }
        console.log('Consulta por semana realizada correctamente. Resultados:', results);
        res.json(results);
    });
});

// Obtener la cantidad de ingresos por mes
app.get('/api/metricas/mes', (req, res) => {
    const { inicio, fin } = req.query;
    const query = `
        SELECT DATE_FORMAT(fecha, '%Y-%m') AS intervalo, COUNT(*) AS total_ingresos 
        FROM ingreso_egreso 
        WHERE fecha BETWEEN ? AND ? 
        AND estado = 1 
        GROUP BY DATE_FORMAT(fecha, '%Y-%m')
    `;
    console.log(`Ejecutando consulta por mes con inicio: ${inicio}, fin: ${fin}`);
    connection.query(query, [inicio, fin], (err, results) => {
        if (err) {
            console.error('Error al realizar la consulta por mes:', err);
            res.status(500).send('Error al realizar la consulta');
            return;
        }
        console.log('Consulta por mes realizada correctamente. Resultados:', results);
        res.json(results);
    });
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
