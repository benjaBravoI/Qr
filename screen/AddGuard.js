import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';


export default function AddGuard({ navigation }) {

    const [rut, setRut] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [fono, setFono] = useState('');
    const [clave, setClave] = useState('');
    const [estado, setEstado] = useState(1); // 1 = activo, 0 = inactivo
    

    const formatRut = (rut) => {
        // Eliminar caracteres no numéricos excepto 'k' o 'K'
        rut = rut.replace(/[^\dkK\d]/g, '');
        // Agregar guión antes del dígito verificador si es necesario
        if (rut.length > 1) {
            rut = rut.replace(/^(\d{1,8})(\d{0,1})$/, '$1-$2');
        }
        return rut;
    }
    
    const validateRut = (rut) => {
        if (!/^[0-9]+-[0-9kK]{1}$/.test(rut)) return false;
        const [rutBody, dv] = rut.split('-');
        let total = 0;
        let factor = 2;
        for (let i = rutBody.length - 1; i >= 0; i--) {
            total += parseInt(rutBody[i]) * factor;
            factor = factor === 7 ? 2 : factor + 1;
        }
        const dvCalculated = 11 - (total % 11);
        if (dvCalculated === 11) return dv.toLowerCase() === '0';
        if (dvCalculated === 10) return dv.toLowerCase() === 'k';
        return dvCalculated === parseInt(dv);
    }

    const handleAddGuard = () => {
        if (!rut || !nombre || !apellido || !correo || !fono || !clave) {
            Alert.alert('Error', 'Debes completar todos los campos');
            return;
        }
        if (!validateRut(rut)) {
            Alert.alert('Error', 'RUT inválido');
            return;
        }
        axios.post('http://192.168.56.1:3000/api/addguardias', {
            rut,
            nombre,
            apellido,
            correo,
            fono,
            clave,
            estado
        })
            .then(() => {
                Alert.alert('Guardia agregado', 'El guardia ha sido agregado exitosamente', [
                    { text: 'OK', onPress: () => navigation.navigate('ListGuard') }
                ]);
            })
            .catch(error => {
                console.error('Error al agregar guardia:', error);
                if (error.response) {
                    console.error('Respuesta del servidor:', error.response.data);
                }
                Alert.alert('Error', 'Hubo un problema al agregar el guardia. Por favor, intenta de nuevo.');
            });
    }
    
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
                        placeholder="Ej. 12345678-9"
                        value={rut}
                    />
                    <Text style={styles.inputLabel}>Nombre</Text>
                    <TextInput
                        style={styles.inputControl}
                        onChangeText={text => setNombre(text.replace(/[^A-Za-z\s]/g, ''))}
                        maxLength={50}
                        placeholder="Ej. Juan"
                        value={nombre}
                    />
                    <Text style={styles.inputLabel}>Apellido</Text>
                    <TextInput
                        style={styles.inputControl}
                        onChangeText={text => setApellido(text.replace(/[^A-Za-z\s]/g, ''))}
                        maxLength={50}
                        placeholder="Ej. Pérez"
                        value={apellido}
                    />

                    <Text style={styles.inputLabel}>Teléfono</Text>
                    <TextInput
                        style={styles.inputControl}
                        keyboardType="numeric"
                        onChangeText={text => setFono(text)}
                        maxLength={9} // Máximo de 9 dígitos
                        placeholder="9XXXXXXXX"
                        value={fono}
                    />

                    <Text style={styles.inputLabel}>Correo</Text>
                    <TextInput
                        style={styles.inputControl}
                        onChangeText={text => setCorreo(text)}
                        maxLength={50}
                        placeholder="Ej. ejemplo@dominio.com"
                        value={correo}
                    />
                   
                    <Text style={styles.inputLabel}>Contraseña</Text>
                    <TextInput
                        style={styles.inputControl}
                        onChangeText={text => setClave(text)}
                        secureTextEntry
                        maxLength={50}
                        value={clave}
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
