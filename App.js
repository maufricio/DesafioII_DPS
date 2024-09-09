import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Datos from './src/Screens/Datos'; 
import Productos_Disponibles from './src/Screens/Productos'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync()

const Tab = createBottomTabNavigator();
export default function App() {

  useEffect(() => {
    setTimeout(async () => {
      await SplashScreen.hideAsync(); //Ocultar Splash despues de 2 segundos
    }, 2000)
  }, [])


  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Datos" component={Datos} /> 
        <Tab.Screen name="Productos_Disponibles" component={Productos_Disponibles} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
