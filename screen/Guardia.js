import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import axios from 'axios';
import { useAuth } from '../authContext';

export default function Guardia({ navigation }) {
  const { user } = useAuth();
  const [lastCheckIn, setLastCheckIn] = useState(null);

  const handleQRButtonPress = () => {
    const rut = '13017685-2';

    axios.get(`http://192.168.56.1:3000/api/verificar_rut/${rut}`)
      .then(response => {
        const { existencia } = response.data;
        if (existencia) {
          handleIngresoEgreso(rut);
        } else {
          Alert.alert('Error', 'RUT no encontrado en la base de datos.');
        }
      })
      .catch(error => {
        console.error('Error al verificar el RUT:', error);
        Alert.alert('Error', 'Hubo un problema al verificar el RUT.');
      });
  };

  const handleIngresoEgreso = (rut) => {
    const data = {
      rut_e: rut,
      rut_g: user.rut,
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toLocaleTimeString(),
      estado: 1,
    };

    axios.post('http://192.168.56.1:3000/api/ingreso_egreso', data)
      .then(response => {
        setLastCheckIn(data);
        Alert.alert('Éxito', 'Registro de Ingreso realizado correctamente.');
        getLastCheckIn(rut);
      })
      .catch(error => {
        console.error('Error al registrar ingreso:', error);
        Alert.alert('Error', 'Hubo un problema al registrar el ingreso.');
      });
  };

  const getLastCheckIn = (rut) => {
    axios.get(`http://192.168.56.1:3000/api/ultimo_registro/${rut}`)
      .then(response => {
        const lastRecord = response.data;
        setLastCheckIn(lastRecord);
      })
      .catch(error => {
        console.error('Error al obtener último registro:', error);
        Alert.alert('Error', 'Hubo un problema al obtener el último registro.');
      });
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>
            Bienvenido {user?.nombre} {user?.apellido}
          </Text>
        </View>
        <View style={styles.logoContainer}>
          <Image
            alt="App Logo"
            resizeMode="contain"
            style={styles.headerImg}
            source={{ uri: 'https://www.universidadesonline.cl/logos/original/logo-universidad-central-de-chile.webp' }}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleQRButtonPress}>
          <Text style={styles.buttonText}>Simular QR</Text>
        </TouchableOpacity>

        {lastCheckIn && (
          <View style={styles.lastCheckInContainer}>
            <Text style={styles.lastCheckInText}>Último registro:</Text>
            <Text>{`Fecha: ${lastCheckIn.fecha} | Hora: ${lastCheckIn.hora}`}</Text>
            <Text>{`Estado: ${lastCheckIn.estado === 1 ? 'Ingreso' : 'Salida'}`}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginTop: 20,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  headerImg: {
    width: 300,
    height: 300,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
    width: '80%',
    alignSelf: 'center',
    backgroundColor: '#354093',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  lastCheckInContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  lastCheckInText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
