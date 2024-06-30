import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';


export default function EditGuardias({ route, navigation }) {
    const [rut, setRut] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [fono, setFono] = useState('');
    const [correo, setCorreo] = useState('');
    const [clave, setClave] = useState('');
    const { guardId } = route.params;

    useEffect(() => {
        fetchGuardById();
    }, []);
    

    const fetchGuardById = () => {
        axios.get(`http://192.168.56.1:3000/api/guardias_rut/${guardId}`)
            .then(response => {
                const { rut, nombre, apellido, fono, correo } = response.data;
                setRut(rut);
                setNombre(nombre);
                setApellido(apellido);
                setFono(fono.toString());
                setCorreo(correo);
            })
            .catch(error => {
                console.error('Error al obtener guardia por rut:', error);
                Alert.alert('Error', 'Hubo un problema al obtener el guardia');
            });
    }

    const handleEditGuard = () => {
        axios.put(`http://192.168.56.1:3000/api/editguardias/${rut}`, {
            nombre,
            apellido,
            fono,
            correo,
            clave,
        })
            .then(() => {
                Alert.alert('Guardia editado', 'El guardia ha sido editado exitosamente', [
                    { text: 'OK', onPress: () => navigation.navigate('ListGuard') }
                ]);
            })
            .catch(error => {
                console.error('Error al editar guardia:', error);
                if (error.response) {
                    console.error('Respuesta del servidor:', error.response.data);
                }
                Alert.alert('Error', 'Hubo un problema al editar el guardia. Por favor, intenta de nuevo.');
            });
    }
    
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
            <ScrollView>
                <Text style={styles.title}>Editar datos del guardia</Text>
                <View style={styles.form}>
                    <Text style={styles.inputLabel}>Rut</Text>
                    <TextInput
                        style={styles.inputControl}
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
                    <Text style={styles.inputLabel}>Teléfono</Text>
                    <TextInput
                        style={styles.inputControl}
                        onChangeText={text => setFono(text)}
                        value={fono}
                        keyboardType="numeric"
                    />
                    <Text style={styles.inputLabel}>Correo</Text>
                    <TextInput
                        style={styles.inputControl}
                        onChangeText={text => setCorreo(text)}
                        value={correo}
                    />
                    <Text style={styles.inputLabel}>Contraseña</Text>
                    <TextInput
                        style={styles.inputControl}
                        onChangeText={text => setClave(text)}
                        secureTextEntry
                        value={clave}
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
