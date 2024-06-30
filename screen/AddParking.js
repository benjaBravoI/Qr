import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';

export default function AddGuard({ navigation }) {
    const [ubicacion, setUbicacion] = useState('');
    const [capacidad, setCapacidad] = useState('');

    const handleAddParking = async () => {
        try {
            // Validación de campos
            if (!ubicacion || !capacidad) {
                throw new Error('Todos los campos son obligatorios');
            }

            // Petición POST al servidor
            const response = await axios.post('http://192.168.56.1:3000/api/addestacionamientos', {
                ubicacion,
                capacidad
            });

            // Mostrar mensaje de éxito
            Alert.alert('Éxito', 'Estacionamiento agregado correctamente', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error('Error al agregar estacionamiento:', error);
            Alert.alert('Error', 'Hubo un problema al agregar el estacionamiento');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
            <ScrollView>
                <Text style={styles.title}>Ingrese los datos del estacionamiento a agregar</Text>
                <View style={styles.form}>
                    <Text style={styles.inputLabel}>Ubicación</Text>
                    <TextInput
                        style={styles.inputControl}
                        onChangeText={text => setUbicacion(text)}
                        value={ubicacion}
                    />
                    <Text style={styles.inputLabel}>Capacidad</Text>
                    <TextInput
                        style={styles.inputControl}
                        keyboardType="numeric"
                        onChangeText={text => setCapacidad(text)}
                        value={capacidad}
                    />
                    <TouchableOpacity style={styles.btn} onPress={handleAddParking}>
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
