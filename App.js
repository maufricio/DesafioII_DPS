import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Datos from './src/Screens/Datos'; 
import Productos_Disponibles from './src/Screens/Productos'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Datos" component={Datos} />
        <Tab.Screen name="Productos_Disponibles" component={Productos_Disponibles} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
