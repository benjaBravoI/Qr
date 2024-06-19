import React from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function EditEstacionamiento({ navigation }) {
    return(
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
            <ScrollView>
                <Text style={styles.title}>Ingrese los datos del estacionamiento a editar</Text>

                <View style={styles.form}>
                    <Text style={styles.inputLabel}>Nombre</Text>
                    <TextInput
                        style={styles.inputControl}
                       
                    /> 
                     <Text style={styles.inputLabel}>Capacidad</Text>
                    <TextInput
                        style={styles.inputControl}
                        keyboardType="numeric"
                    />

                    <TouchableOpacity style={styles.btn}>
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
    
