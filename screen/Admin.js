import React, { useContext } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuth } from '../authContext';

export default function Admin({ navigation }) {
  const { user, logout } = useAuth();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <View style={styles.container}>
        
          <View style={styles.header}>
            <Text style={styles.subtitle}>
              Bienvenido {user?.nombre} {user?.apellido}
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ListGuard')}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: 'https://cdn-icons-png.freepik.com/512/4009/4009133.png' }}
                  style={styles.image}
                />
              </View>
              <Text style={styles.optionText}>Guardias</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Metricas')}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1340/1340003.png' }}
                  style={styles.image}
                />
              </View>
              <Text style={styles.optionText}>Métricas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ListParking')}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2343/2343894.png' }}
                  style={styles.image}
                />
              </View>
              <Text style={styles.optionText}>Estacionamientos</Text>
            </TouchableOpacity>
          </View>        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    paddingTop: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  logout: {
    fontSize: 13,
    backgroundColor: '#ffffff',
    fontWeight: '500',
    color: 'black',
    marginBottom: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  optionsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  option: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
});
