import React, { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { useAuth } from '../authContext';

export default function Login({ navigation }) {
  const { login } = useAuth();
  const [form, setForm] = useState({
    rut: '',
    clave: '',
  });
  
  const formatRut = (rut) => {
    // Eliminar caracteres no numéricos excepto 'k' o 'K'
    rut = rut.replace(/[^\dkK\d]/g, '');
    // Agregar guión antes del dígito verificador si es necesario
    if (rut.length > 1) {
        rut = rut.replace(/^(\d{1,8})(\d{0,1})$/, '$1-$2');
    }
    return rut;
}


  const handleLogin = () => {
    axios.post('http://192.168.56.1:3000/api/login', form)
      .then(response => {
        const { rut, role, nombre, apellido } = response.data;
        login({ rut, role, nombre, apellido });
        if (role === 'admin') {
          navigation.navigate('Admin');
        } else if (role === 'guardia') {
          navigation.navigate('Guardia');
        } else {
          Alert.alert('Error', 'Credenciales incorrectas');
        }
      })
      .catch(error => {
        console.error('Error al iniciar sesión:', error);
        if (error.response) {
          console.error('Respuesta del servidor:', error.response.data);
        }
        Alert.alert('Error', 'Hubo un problema con el inicio de sesión. Por favor, verifica tus credenciales.');
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8ecf4' }}>
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.header}>
            <Image
              alt="App Logo"
              resizeMode="contain"
              style={styles.headerImg}
              source={{
                uri: 'https://www.universidadesonline.cl/logos/original/logo-universidad-central-de-chile.webp',
              }} 
            />
            <Text style={styles.title}>
              Bienvenido
            </Text>
            <Text style={styles.subtitle}>
              Inicia sesión para continuar
            </Text>
          </View>
          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Rut</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="email-address"
                onChangeText={rut => setForm({ ...form, rut: formatRut(rut) })}
                
                placeholder="Ingrese Su Rut"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.rut} 
              />
            </View>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Clave</Text>
              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={clave => setForm({ ...form, clave })}
                placeholder="Ingrese Su Contraseña"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={form.clave} 
              />
            </View>
            <View style={styles.formAction}>
              <TouchableOpacity onPress={handleLogin}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Iniciar Sesión</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
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
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  headerImg: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 36,
  },
  form: {
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
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
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#354093',
    shadowColor: 'rgba(18, 18, 18, 0.1)',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 20,
    shadowOpacity: 1,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F3F4F9',
  },
});
