import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Ingresos from './FormIngresos';
import Egresos from './FormEgresos';
import Grafica from './Graficas';
import 'react-native-get-random-values';
const Drawer = createDrawerNavigator();
export default function Datos() {
  return (
      <Drawer.Navigator initialRouteName="Ingresos">
        <Drawer.Screen name="Ingresos" component={Ingresos}  />
        <Drawer.Screen name="Egresos" component={Egresos}  />
        <Drawer.Screen name="Graficas" component={Grafica}  />
      </Drawer.Navigator>
      );
}
