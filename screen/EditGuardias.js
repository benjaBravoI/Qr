import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import bcrypt from 'react-native-bcrypt';

export default function EditGuardias({ route, navigation }) {
    const [rut, setRut] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [contrasena, setContrasena] = useState('');
    const { guardId } = route.params;

    useEffect(() => {
        fetchGuardById();
    }, []);
    
    const saltRounds = 10;

    const hashPassword = async (password) => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds, (err, hash) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });
    }

    const fetchGuardById = () => {
        axios.get(`http://192.168.56.1:3000/api/guardias_rut/${guardId}`)
            .then(response => {
                const { rut, nombre, apellido, correo, telefono } = response.data;
                setRut(rut);
                setNombre(nombre);
                setApellido(apellido);
                setCorreo(correo);
                setTelefono(telefono);
                // No inicializar contrasena con el valor hasheado
            })
            .catch(error => {
                console.error('Error al obtener guardia por rut:', error);
                Alert.alert('Error', 'Hubo un problema al obtener el guardia');
            });
    }

    const handleEditGuard = async() => {
        try {
            // Validación de campos
            if (!nombre || !apellido || !correo || !telefono) {
                Alert.alert('Error', 'Todos los campos son requeridos');
                return;
            }
            
            // Validación de formato de teléfono
            if (!/^\d{9}$/.test(telefono)) {
                Alert.alert('Error', 'El teléfono debe contener 9 dígitos');
                return;
            }

            // Validación de nombre y apellido
            if (!/^[a-zA-Z\s]*$/.test(nombre) || !/^[a-zA-Z\s]*$/.test(apellido)) {
                Alert.alert('Error', 'El nombre y el apellido solo pueden contener letras y espacios en blanco');
                return;
            }

            let dataToUpdate = { nombre, apellido, correo, telefono};
            if (contrasena) {
                const hashedPassword = await hashPassword(contrasena);
                dataToUpdate = { ...dataToUpdate, contrasena: hashedPassword };
            }
            const response = await axios.put(`http://192.168.56.1:3000/api/editguardias/${guardId}`, dataToUpdate);
            Alert.alert('Guardia editado', 'El guardia ha sido editado correctamente');
            navigation.goBack();
        } catch (error) {
            console.error('Error al editar guardia:', error);
            Alert.alert('Error', 'Hubo un problema al editar el guardia');
        }
    }
    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
            <ScrollView>
                <Text style={styles.title}>Editar datos del guardia</Text>
                <View style={styles.form}>
                    <Text style={styles.inputLabel}>Rut</Text>
                    <TextInput
                        style={styles.inputControl}
                        keyboardType="numeric"
                        value={rut}
                        editable={false} // Hacer no editable
                    />
                    <Text style={styles.inputLabel}>Nombre</Text>
                    <TextInput
                        style={styles.inputControl}
                        onChangeText={text => setNombre(text)}
                        value={nombre}
                    />
                    <Text style={styles.inputLabel}>Apellido</Text>
                    <TextInput
                        style={styles.inputControl}
                        onChangeText={text => setApellido(text)}
                        value={apellido}
                    />
                    <Text style={styles.inputLabel}>Correo</Text>
                    <TextInput
                        style={styles.inputControl}
                        onChangeText={text => setCorreo(text)}
                        value={correo}
                    />
                    <Text style={styles.inputLabel}>Teléfono</Text>
                    <TextInput
                        style={styles.inputControl}
                        keyboardType="numeric"
                        onChangeText={text => setTelefono(text)}
                        value={telefono}
                        maxLength={9} // Máximo de 9 dígitos
                        placeholder="9XXXXXXXX"
                    />
                    <Text style={styles.inputLabel}>Contraseña</Text>
                    <TextInput
                        style={styles.inputControl}
                        onChangeText={text => setContrasena(text)}
                        secureTextEntry  
                        value={contrasena}
                    />
                    <TouchableOpacity style={styles.btn} onPress={handleEditGuard}>
                        <Text style={styles.btnText}>Guardar cambios</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    form: {
        padding: 12,
    },
    inputLabel: {
        fontSize: 16,
        marginVertical: 5,
    },
    inputControl: {
        height: 50,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 15,
        fontWeight: '500',
        color: '#222',
        borderWidth: 1,
        borderColor: '#C9D3DB',
        borderStyle: 'solid',
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        backgroundColor: '#354093',
        borderColor: '#354093',
        marginVertical: 20,
    },
    btnText: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '600',
        color: '#fff',
    },
});
