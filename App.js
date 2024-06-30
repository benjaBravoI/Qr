import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, Icon } from 'react-native-elements';
import { AuthProvider, useAuth } from './authContext';

// Components
import Login from "./screen/Login";
import Admin from "./screen/Admin";
import Guardia from "./screen/Guardia";
import AddGuard from "./screen/AddGuard";
import AddParking from "./screen/AddParking";
import ListGuard from "./screen/ListGuard";
import ListParking from "./screen/ListParking";
import EditGuardias from "./screen/EditGuardias";
import EditEstacionamiento from "./screen/EditEstacionamiento";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={screenOptions}
        >
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen 
            name="Admin" 
            component={Admin} 
            options={({ navigation }) => ({
              title: 'Menu',
              headerLeft: ()=> null,
              headerRight: () => <LogoutButton navigation={navigation} />,
            })} 
          />
          <Stack.Screen 
            name="Guardia" 
            component={Guardia} 
            options={({ navigation }) => ({
              title: 'Menu',
              headerLeft: () => null,
              headerRight: () => <LogoutButton navigation={navigation} />,
              
            })} 
          />
          <Stack.Screen 
            name="ListGuard" 
            component={ListGuard} 
            options={({ navigation }) => ({
              title: "Lista de guardias",
              headerRight: () => (
                <Button
                  onPress={() => navigation.navigate("AddGuard")}
                  type="clear"
                  icon={<Icon name="add" size={30} color="#fff" />}
                />
              ),
            })}
          />
          <Stack.Screen name="EditGuardias" component={EditGuardias} options={{ title: 'Editar Guardias' }} />
          <Stack.Screen name="EditEstacionamiento" component={EditEstacionamiento} options={{ title: 'Editar Estacionamientos' }} />
          <Stack.Screen name="AddGuard" component={AddGuard} options={{ title: 'Agregar Guardia' }} />
          <Stack.Screen name="AddParking" component={AddParking} options={{ title: 'Agregar Estacionamiento' }} />
          <Stack.Screen 
            name="ListParking" 
            component={ListParking} 
            options={({ navigation }) => ({
              title: "Lista de Estacionamientos",
              headerRight: () => (
                <Button
                  onPress={() => navigation.navigate("AddParking")}
                  type="clear"
                  icon={<Icon name="add" size={30} color="#fff" />}
                />
              ),
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

const LogoutButton = ({ navigation }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigation.navigate('Login');
  };

  return (
    <Button
      onPress={handleLogout}
      type="clear"
      title="Cerrar sesión"
      titleStyle={{ color: '#fff' }}
    />
  );
};

const screenOptions = {
  headerStyle: {
    backgroundColor: '#354093',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

export default App;
