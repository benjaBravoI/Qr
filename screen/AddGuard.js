import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import bcrypt from 'react-native-bcrypt';

export default function AddGuard({ navigation }) {

    const [rut, setRut] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [estado, setEstado] = useState(1); // 1 = activo, 0 = inactivo
    const [tipo_guardia, setTipoGuardia] = useState(2);

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

    const formatRut = (rut) => {
        // Eliminar caracteres no numéricos
        rut = rut.replace(/[^\d]/g, '');
        // Agregar puntos y guión según formato chileno
        rut = rut.replace(/^(\d{1,2})(\d{3})(\d{3})(\w{1})$/, '$1.$2.$3-$4');
        return rut;
    }

    const handleAddGuard = async () => {
        try {
            const hashedPassword = await hashPassword(contrasena);
            const response = await axios.post('http://192.168.56.1:3000/api/addguardias', { 
                rut, 
                nombre, 
                apellido, 
                correo, 
                telefono, 
                contrasena: hashedPassword, 
                estado, 
                tipo_guardia 
            });
            
            Alert.alert('Guardia agregado', 'El guardia ha sido agregado correctamente');
            navigation.goBack();
        } catch (error) {
            console.error('Error al agregar guardia:', error);
            Alert.alert('Error', 'Hubo un problema al agregar el guardia');
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
            <ScrollView>
                <Text style={styles.title}>Ingrese los datos del guardia a agregar</Text>

                <View style={styles.form}>
                    <Text style={styles.inputLabel}>Rut</Text>
                    <TextInput
                        style={styles.inputControl}
                        keyboardType="numeric"
                        onChangeText={text => setRut(formatRut(text))}
                        maxLength={12}
                        placeholder="Ej. 1.234.567-8"
                        value={rut}
                    />
                    <Text style={styles.inputLabel}>Nombre</Text>
                    <TextInput
                        style={styles.inputControl}
                        onChangeText={text => setNombre(text.replace(/[^A-Za-z\s]/g, ''))}
                        maxLength={50}
                        placeholder="Ej. Juan"
                        
                    />
                    <Text style={styles.inputLabel}>Apellido</Text>
                    <TextInput
                        style={styles.inputControl}
                        onChangeText={text => setApellido(text.replace(/[^A-Za-z\s]/g, ''))}
                        maxLength={50}
                        placeholder="Ej. Pérez"
                        
                    />
                    <Text style={styles.inputLabel}>Correo</Text>
                    <TextInput
                        style={styles.inputControl}
                        onChangeText={text => setCorreo(text)}
                        maxLength={50}
                        placeholder="Ej. ejemplo@dominio.com"
                    />
                    <Text style={styles.inputLabel}>Teléfono</Text>
                    <TextInput
                        style={styles.inputControl}
                        keyboardType="numeric"
                        onChangeText={text => setTelefono(text)}
                        maxLength={9} // Máximo de 9 dígitos
                        placeholder="9XXXXXXXX"
                    />
                    <Text style={styles.inputLabel}>Contraseña</Text>
                    <TextInput
                        style={styles.inputControl}
                        onChangeText={text => setContrasena(text)}
                        secureTextEntry
                        maxLength={50}
                    />

                    <TouchableOpacity style={styles.btn} onPress={handleAddGuard}>
                        <Text style={styles.btnText}>Agregar</Text>
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
