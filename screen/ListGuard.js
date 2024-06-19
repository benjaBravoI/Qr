import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import { ListItem, Avatar, Button, Icon } from 'react-native-elements';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

export default function ListGuard({ navigation }) {
  const [list, setList] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchGuardias();
    }, [])
  );

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const fetchGuardias = () => {
    axios.get('http://192.168.56.1:3000/api/guardias')
      .then(response => {
        const data = response.data.map(item => ({
          rut: item.rut,
          name: item.nombre + ' ' + item.apellido,
          subtitle: item.rut,
          avatar_url: item.avatar_url,
          correo: item.correo,
          telefono: item.telefono,
        }));
        setList(data);
      })
      .catch(error => {
        console.error('Error al obtener los guardias:', error);
      });
  };

  const confirmDeletion = (item) => {
    Alert.alert(
      'Eliminar guardia',
      `¿Estás seguro de eliminar a ${item.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => deleteGuardia(item.rut) },
      ],
      { cancelable: false }
    );
  }

  const deleteGuardia = (rut) => {
    axios.put(`http://192.168.56.1:3000/api/deleteguardias/${rut}`)
      .then(() => {
        fetchGuardias();
      })
      .catch(error => {
        console.error('Error al eliminar el guardia:', error);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <FlatList
        keyExtractor={(item) => item.rut}
        data={list}
        renderItem={({ item, index }) => (
          <View>
            <TouchableOpacity onPress={() => toggleExpand(index)}>
              <ListItem>
                <Avatar source={{ uri: item.avatar_url }} />
                <ListItem.Content>
                  <ListItem.Title>{item.name}</ListItem.Title>
                  <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            </TouchableOpacity>
            {expandedIndex === index && (
              <View style={styles.expandedView}>
                <Text style={styles.detailText}>Email: {item.correo}</Text>
                <Text style={styles.detailText}>Teléfono: {item.telefono}</Text>
                <View style={styles.buttonContainer}>
                  <Button
                    onPress={() => navigation.navigate("EditGuardias", { guardId: item.rut })}
                    type="clear"
                    icon={<Icon name="edit" size={25} color="grey" />}
                  />
                  <Button
                    onPress={() => confirmDeletion(item)}
                    type="clear"
                    icon={<Icon name="delete" size={25} color="grey" />}
                  />
                </View>
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  expandedView: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  detailText: {
    fontSize: 16,
    marginVertical: 2,
  },
});
