import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';  // Importamos StackNavigator
import Datos from './src/Screens/Datos'; 
import Productos from './src/Screens/Productos';  // Pantalla de productos (ya no Productos_Disponibles)
import FormTarjeta from './src/Screens/FormTarjeta';  // Pantalla del formulario
import 'bootstrap/dist/css/bootstrap.min.css';
import * as SplashScreen from 'expo-splash-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();  // Creamos el StackNavigator

// Definimos un StackNavigator para los productos
function ProductosStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Productos" 
        component={Productos} 
        options={{ title: 'Productos Disponibles' }} 
      />
      <Stack.Screen 
        name="Tarjeta" 
        component={FormTarjeta} 
        options={{ title: 'Formulario de Producto' }} 
      />
    </Stack.Navigator>
  );
}

const App = () => {

  useEffect(() => {
    setTimeout(async () => {
      await SplashScreen.hideAsync(); // Ocultar Splash después de 2 segundos
    }, 2000);
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name="Datos" 
          component={Datos} 
          options={{ 
            title: 'Datos',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Icon name="folder" size={size} color={color} />
            ),
          }} 
        />
        
        {/* Ahora usamos el StackNavigator dentro de esta pestaña */}
        <Tab.Screen 
          name="Productos_Disponibles" 
          component={ProductosStack}  // Usamos el stack de productos
          options={{ 
            title: 'Productos Disponibles',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Icon name="payment" size={size} color={color} />
            ),
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
