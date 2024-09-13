import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Datos from './src/Screens/Datos'; 
import Productos_Disponibles from './src/Screens/Productos'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import * as SplashScreen from 'expo-splash-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';

SplashScreen.preventAutoHideAsync()
const Tab = createBottomTabNavigator();

const App = () => {

  useEffect(() => {
    setTimeout(async () => {
      await SplashScreen.hideAsync(); //Ocultar Splash despues de 2 segundos
    }, 2000)
  }, [])


  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Datos" component={Datos} options={{ 
          title : 'Datos',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="folder" size={size} color={color} />
          )
          }} /> 
        <Tab.Screen name="Productos_Disponibles" component={Productos_Disponibles} options={{ 
          title : 'Productos Disponibles',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="payment" size={size} color={color} />
          )
          }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App
