import { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ingresos from './FormIngresos';
import Egresos from './FormEgresos';
import Grafica from './Graficas';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Drawer = createDrawerNavigator();

const Datos = () => {

  const [updateGraphData, setUpdateGraphData] = useState(() => () => { });

  const handleDataChange = (updateFunction) => {
    setUpdateGraphData(() => updateFunction);
  };


  return (
    <Drawer.Navigator initialRouteName="Ingresos">
      <Drawer.Screen name="Ingresos" options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="attach-money" size={size} color={color} />
          ),
        }}>
        {() => <Ingresos update={handleDataChange} />}
      </Drawer.Screen>
      <Drawer.Screen name="Egresos" options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="currency-exchange" size={size} color={color} />
          ),
        }}>
        {()=> <Egresos update={handleDataChange}></Egresos>}
      </Drawer.Screen>
      <Drawer.Screen name="Graficas" options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="signal-cellular-alt" size={size} color={color} />
          ),
        }}>
        {() => <Grafica onDataChange={updateGraphData} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

export default Datos;