import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import axios from 'axios';
import { useAuth } from '../authContext';
import DropdownModal from './DropdownModal';

export default function Guardia({ navigation }) {
  const { user } = useAuth();
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [parkingLot, setParkingLot] = useState('');
  const [disponibilidad, setDisponibilidad] = useState(null); // Nuevo estado para la disponibilidad
  const [capacidad, setCapacidad] = useState(null); // Nuevo estado para la capacidad del estacionamiento

  useEffect(() => {
    if (parkingLot) {
      getDisponibilidad(parkingLot);
      getCapacidad(parkingLot);
    }
  }, [parkingLot]);

  const handleQRButtonPress = () => {
    const rut = '3'; // Ejemplo, reemplazar con un valor dinámico
  
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
        Alert.alert('Error', 'RUT no registrado.');
      });
  };

  const handleIngresoEgreso = (rut) => {
    // Consulta el último registro para determinar si es ingreso o egreso
    axios.get(`http://192.168.56.1:3000/api/ultimo_registro/${rut}`)
      .then(response => {
        const lastRecord = response.data;
        const nuevoEstado = lastRecord && lastRecord.estado === 1 ? 0 : 1; // Cambiar de ingreso a egreso y viceversa
  
        const data = {
          rut_e: rut,
          rut_g: user.rut,
          fecha: new Date().toISOString().split('T')[0],
          hora: new Date().toLocaleTimeString(),
          id_es: parkingLot,
          estado: nuevoEstado,
        };
  
        axios.post('http://192.168.56.1:3000/api/ingreso_egreso', data)
          .then(response => {
            setLastCheckIn(data);
            Alert.alert('Éxito', 'Registro de Ingreso o Egreso realizado correctamente.');
            getDisponibilidad(parkingLot); // Obtener disponibilidad después de registrar ingreso/egreso
          })
          .catch(error => {
            console.error('Error al registrar ingreso:', error);
            Alert.alert('Error', 'Hubo un problema al registrar el ingreso.');
          });
      })
      .catch(error => {
        console.error('Error al obtener último registro:', error);
        Alert.alert('Error', 'Hubo un problema al obtener el último registro.');
      });
  };
  
  const getDisponibilidad = (id_es) => {
    axios.get(`http://192.168.56.1:3000/api/disponibilidad/${id_es}`)
      .then(response => {
        setDisponibilidad(response.data.cantidad);
      })
      .catch(error => {
        console.error('Error al obtener la disponibilidad:', error);
        Alert.alert('Error', 'Hubo un problema al obtener la disponibilidad.');
      });
  };

  const getCapacidad = (id_es) => {
    axios.get(`http://192.168.56.1:3000/api/capacidad/${id_es}`)
      .then(response => {
        setCapacidad(response.data.capacidad);
      })
      .catch(error => {
        console.error('Error al obtener la capacidad:', error);
        Alert.alert('Error', 'Hubo un problema al obtener la capacidad.');
      });
  };



  const handleSelectParking = (parking) => {
    setParkingLot(parking.value);
    getDisponibilidad(parking.value); // Obtener disponibilidad al seleccionar estacionamiento
    getCapacidad(parking.value); // Obtener capacidad al seleccionar estacionamiento
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
  
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Seleccionar Estacionamiento</Text>
        </TouchableOpacity>

        {lastCheckIn !== null && ( 
          <View style={styles.lastCheckInContainer}>
            <Text style={styles.lastCheckInText}>Último Ingreso o Egreso:</Text>
            <Text>{`RUT: ${lastCheckIn.rut_e}, Fecha: ${lastCheckIn.fecha}, Hora: ${lastCheckIn.hora}, Estado: ${lastCheckIn.estado === 1 ? 'Ingreso' : 'Egreso'}`}</Text>
          </View>
        )}
  
        {disponibilidad !== null && capacidad !== null && (
          <View style={styles.lastCheckInContainer}>
            <Text style={styles.lastCheckInText}>Disponibilidad del estacionamiento:</Text>
            <Text>{`Cantidad de vehículos estacionados: ${disponibilidad}/${capacidad}`}</Text>
          </View>
        )}
  
        <DropdownModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onSelectParking={handleSelectParking}
        />
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
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#354093',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
