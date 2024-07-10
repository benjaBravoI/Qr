// DropdownModal.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';

const DropdownModal = ({ isVisible, onClose, onSelectParking }) => {
  const [parkingLots, setParkingLots] = useState([]);
  const [selectedParking, setSelectedParking] = useState(null);

  useEffect(() => {
    axios.get('http://192.168.56.1:3000/api/estacionamientosDropdown')
      .then(response => {
        const formattedData = response.data.map(parking => ({
          label: parking.ubicacion,
          value: parking.id_es
        }));
        setParkingLots(formattedData);
      })
      .catch(error => {
        console.error('Error al obtener estacionamientos:', error);
      });
  }, []);

  const handleSelectParking = (item) => {
    setSelectedParking(item.value);
    onSelectParking(item);
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Seleccionar Estacionamiento</Text>
        <Dropdown
          data={parkingLots}
          labelField="label"
          valueField="value"
          placeholder="Seleccionar Estacionamiento"
          value={selectedParking}
          onChange={handleSelectParking}
          style={styles.dropdown}
        />
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#354093',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default DropdownModal;
