import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';

export default function EditEstacionamiento({ route, navigation }) {
    const [id_es, setId_es] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [capacidad, setCapacidad] = useState('');
    const { estacionamientoId } = route.params;

    useEffect(() => {
        fetchEstacionamientoById();
    }, []);

    const fetchEstacionamientoById = () => {
        axios.get(`http://192.168.56.1:3000/api/estacionamientosID/${estacionamientoId}`)
            .then(response => {
                const { id_es, ubicacion, capacidad } = response.data;
                setId_es(id_es);
                setUbicacion(ubicacion);
                setCapacidad(capacidad);
            })
            .catch(error => {
                console.error('Error al obtener estacionamiento por id:', error);
                Alert.alert('Error', 'Hubo un problema al obtener el estacionamiento');
            });
    }

    const handleEditEstacionamiento = async () => {
        try {
            // Validación de campos
            if (!ubicacion || !capacidad) {
                Alert.alert('Error', 'Todos los campos son requeridos');
                return;
            }
    
            // Validación de formato de capacidad
            if (!/^\d+$/.test(capacidad)) {
                Alert.alert('Error', 'La capacidad debe ser un número entero');
                return;
            }
    
            // Envío de datos al servidor
            const response = await axios.put(`http://192.168.56.1:3000/api/editestacionamientos/${estacionamientoId}`, { ubicacion, capacidad });
            
            Alert.alert('Éxito', 'Estacionamiento editado correctamente');
            navigation.navigate('ListParking');
        } catch (error) {
            console.error('Error al editar estacionamiento:', error);
            Alert.alert('Error', 'Hubo un problema al editar el estacionamiento');
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
            <ScrollView>
                <Text style={styles.title}>Ingrese los datos del estacionamiento a editar</Text>

                <View style={styles.form}>
                    <Text style={styles.inputLabel}>ID</Text>
                    <TextInput
                        style={styles.inputControl}
                        value={id_es.toString()}
                        editable={false}
                    />

                    <Text style={styles.inputLabel}>Ubicación</Text>
                    <TextInput
                        style={styles.inputControl}
                        onChangeText={setUbicacion}
                        value={ubicacion}
                    /> 
                    <Text style={styles.inputLabel}>Capacidad</Text>
                    <TextInput
                        style={styles.inputControl}
                        keyboardType="numeric"
                        onChangeText={setCapacidad}
                        value={capacidad.toString()}
                    />

                    <TouchableOpacity style={styles.btn} onPress={handleEditEstacionamiento}>
                        <Text style={styles.btnText}>Editar</Text>
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
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
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
