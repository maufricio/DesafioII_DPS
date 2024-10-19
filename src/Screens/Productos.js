import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Data from '../Conection/Data'
import axios from 'axios';

const url_ingreso = Data + '/listingreso'
const url_egreso = Data + '/listegreso'

export default function Productos() {
  const [ingresos, setIngresos] = useState(0);
  const [egresos, setEgresos] = useState(0);
  const [calificacion, setCalificacion] = useState('');
  const [productos, setProductos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const retrieveData = async () => {
    try {
      const responseIngresos = await axios.get(url_ingreso);
      const responseEgresos = await axios.get(url_egreso);

      const totalIngresos = responseIngresos.data.reduce((acc, item) => acc + item.Monto, 0);
      const totalEgresos = responseEgresos.data.reduce((acc, item) => acc + item.Monto, 0);
      const disponibilidad = ((totalIngresos - totalEgresos) / totalIngresos) * 100;

      setIngresos(totalIngresos);
      setEgresos(totalEgresos);
      evaluarRango(totalIngresos, disponibilidad);
    } catch (error) {
      console.error('Error al recuperar datos:', error);
    }
  };

  const evaluarRango = (ingresos, disponibilidad) => {
    if (ingresos < 360) {
      setCalificacion('Riesgo Alto');
      setProductos(['Apertura de cuenta']);
    } else if (ingresos >= 360 && ingresos < 700) {
      if (disponibilidad < 40) {
        setCalificacion('Riesgo Alto');
        setProductos(['Apertura de cuenta']);
      } else {
        setCalificacion('Riesgo Suficiente');
        setProductos(['Apertura de cuenta', 'Tarjeta de Crédito Clásica', 'Crédito personal hasta $2,000.00']);
      }
    } else if (ingresos >= 700 && ingresos < 1200) {
      if (disponibilidad < 20) {
        setCalificacion('Riesgo Alto');
        setProductos(['Apertura de cuenta']);
      } else if (disponibilidad >= 20 && disponibilidad <= 40) {
        setCalificacion('Riesgo Suficiente');
        setProductos(['Apertura de cuenta', 'Tarjeta de Crédito Clásica', 'Crédito personal hasta $8,000.00']);
      } else {
        setCalificacion('Riesgo Bueno');
        setProductos(['Apertura de cuenta', 'Tarjeta de Crédito Clásica', 'Tarjeta de Crédito Oro', 'Crédito personal hasta $8,000.00']);
      }
    } else if (ingresos >= 1200 && ingresos < 3000) {
      if (disponibilidad < 20) {
        setCalificacion('Riesgo Suficiente');
        setProductos(['Apertura de cuenta']);
      } else if (disponibilidad >= 20 && disponibilidad <= 40) {
        setCalificacion('Riesgo Bueno');
        setProductos(['Apertura de cuenta', 'Tarjeta de Crédito Clásica', 'Tarjeta de Crédito Oro', 'Crédito personal hasta $25,000.00']);
      } else {
        setCalificacion('Riesgo Muy Bueno');
        setProductos(['Apertura de cuenta', 'Tarjeta de Crédito Clásica', 'Tarjeta de Crédito Oro', 'Tarjeta de Crédito Platinum', 'Crédito personal hasta $25,000.00']);
      }
    } else if (ingresos >= 3000) {
      if (disponibilidad < 20) {
        setCalificacion('Riesgo Bueno');
        setProductos(['Apertura de cuenta']);
      } else if (disponibilidad >= 20 && disponibilidad < 30) {
        setCalificacion('Riesgo Muy Bueno');
        setProductos(['Apertura de cuenta', 'Tarjeta de Crédito Clásica', 'Tarjeta de Crédito Oro', 'Crédito personal hasta $50,000.00']);
      } else {
        setCalificacion('Riesgo Excelente');
        setProductos(['Apertura de cuenta', 'Tarjeta de Crédito Clásica', 'Tarjeta de Crédito Oro', 'Tarjeta de Crédito Platinum', 'Tarjeta de Crédito Black', 'Crédito personal hasta $50,000.00']);
      }
    }
  };

  useEffect(() => {
    retrieveData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    retrieveData().then(() => setRefreshing(false));
  };

  // Función que asigna colores a cada tarjeta
  const getCardStyle = (producto) => {
    switch (producto) {
      case 'Tarjeta de Crédito Oro':
        return { ...styles.tarjetaOro, color: 'black' };  // Texto negro en tarjeta dorada
      case 'Tarjeta de Crédito Platinum':
        return styles.tarjetaPlatinum;
      case 'Tarjeta de Crédito Clásica':
        return styles.tarjetaClasica;
      case 'Apertura de cuenta':
        return { ...styles.tarjetaBlanca, color: 'black' };  // Texto negro en tarjeta blanca
      default:
        return styles.tarjetaDefault;
    }
  };

  const getTextColor = (producto) => {
    switch (producto) {
      case 'Tarjeta de Crédito Oro':
        return 'black'; // Texto negro para tarjeta dorada
      case 'Tarjeta de Crédito Platinum':
        return 'white'; // Texto blanco para tarjeta plateada
      case 'Tarjeta de Crédito Clásica':
        return 'white'; // Texto blanco para tarjeta azul
      case 'Apertura de cuenta':
        return 'black'; // Texto negro para tarjeta blanca
      default:
        return 'white'; // Texto blanco por defecto
    }
  };

  return (
    <>

      {productos.length > 0 ? (

        <View style={styles.container}>
          <Text>Total Ingresos: {ingresos}</Text>
          <Text>Total Egresos: {egresos}</Text>
          <Text>Calificación de Riesgo: {calificacion}</Text>
          <Text>Productos sugeridos:</Text>

          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {productos.map((producto, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.card, getCardStyle(producto)]}
                onPress={() => navigation.navigate('Tarjeta', { producto })}
              >
                {/* Aplica el color del texto dinámicamente */}
                <Text style={[styles.productoText, { color: getTextColor(producto) }]}>
                  {producto}
                </Text>
                <Text style={[styles.tarjetaNumero, { color: getTextColor(producto) }]}>
                  **** **** **** 1234
                </Text>
                <Text style={[styles.tarjetaFecha, { color: getTextColor(producto) }]}>
                  Vence: 12/25
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : (
        <View>
          <Text>No tienes productos por el momento</Text>
        </View>
      )}



    </>
  );

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    padding: 20,
    borderRadius: 15, // Bordes redondeados
    marginVertical: 15,
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    flexDirection: 'column', // Contenido dentro de la tarjeta apilado verticalmente
    justifyContent: 'space-between', // Espaciado dentro de la tarjeta
    height: 200, // Altura fija para simular una tarjeta de crédito
  },
  productoText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tarjetaNumero: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    marginTop: 10,
  },
  tarjetaFecha: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 5,
  },
  tarjetaLogo: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 50,
    height: 30,
  },
  tarjetaOro: {
    backgroundColor: '#DAA520', // Dorado metálico
  },
  tarjetaPlatinum: {
    backgroundColor: '#C0C0C0', // Plateado metálico
  },
  tarjetaClasica: {
    backgroundColor: '#1E90FF', // Azul profundo
  },
  tarjetaBlanca: {
    backgroundColor: '#F8F8FF', // Blanco tenue
  },
});

/*  const retrieveData = async () => {
try {
  const response = await axios.get('https://tubasededatos/api/obtenerDatos');
  const { ingresos, egresos } = response.data;
  setIngresos(ingresos);
  setEgresos(egresos);

  const disponibilidad = ((ingresos - egresos) / ingresos) * 100;
  evaluarRango(ingresos, disponibilidad);
} catch (error) {
  console.error('Error al recuperar datos:', error);
}
};*/

