import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { ListItem, Avatar, Button, Icon } from 'react-native-elements';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

export default function ListGuard({ navigation }) {
    const [list, setList] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);

    useFocusEffect(
        useCallback(() => {
            fetchEstacionamientos();
        }, [])
    );

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const fetchEstacionamientos = () => {
        axios.get('http://192.168.56.1:3000/api/estacionamientos')
            .then(response => {
                const data = response.data.map(item => ({
                    id_es: item.id_es,
                    name: item.ubicacion,
                    avatar_url: item.avatar_url,
                    capacidad: item.capacidad,
                    estado: item.estado // Asegúrate de tener el estado en la respuesta
                }));
                setList(data);
            })
            .catch(error => {
                console.error('Error al obtener los estacionamientos:', error);
            });
    }

    const confirmEdit = (item) => {
        Alert.alert(
            'Editar estacionamiento',
            `¿Estás seguro de editar el estacionamiento?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Editar', onPress: () => navigation.navigate("EditEstacionamiento", { estacionamientoId: item.id_es }) },
            ],
            { cancelable: false }
        );
    }

    const confirmDeletion = (item) => {
        Alert.alert(
            'Eliminar estacionamiento',
            `¿Estás seguro de eliminar el estacionamiento?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Eliminar', onPress: () => deleteEstacionamiento(item.id_es) },
            ],
            { cancelable: false }
        );
    }


    const deleteEstacionamiento = (id_es) => {
    axios.put(`http://192.168.56.1:3000/api/delete_es/${id_es}`)
        .then(() => {
            fetchEstacionamientos();
            Alert.alert('Estacionamiento eliminado', 'El estacionamiento ha sido eliminado correctamente');
        })
        .catch(error => {
            console.error('Error al eliminar el estacionamiento:', error);
            Alert.alert('Error', 'Hubo un problema al eliminar el estacionamiento');
        });
}

    



   
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
            <FlatList
                keyExtractor={(item) => item.id_es.toString()}
                data={list}
                renderItem={({ item }) => (
                    <View>
                        <TouchableOpacity onPress={() => toggleExpand(item.id_es)}>
                            <ListItem>
                                <Avatar source={{ uri: item.avatar_url }} />
                                <ListItem.Content>
                                    <ListItem.Title>{item.name}</ListItem.Title>
                                    <ListItem.Subtitle>{item.subtitle}</ListItem.Subtitle>
                                </ListItem.Content>
                            </ListItem>
                        </TouchableOpacity>
                        {expandedIndex === item.id_es && (
                            <View style={styles.expandedView}>
                                <Text style={styles.detailText}>Capacidad: {item.capacidad}</Text>
                                <View style={styles.buttonContainer}>
                                    <Button
                                        onPress={() => confirmEdit(item)}
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
