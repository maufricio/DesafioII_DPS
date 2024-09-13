import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Productos() {
  const [ingresos, setIngresos] = useState(0);
  const [egresos, setEgresos] = useState(0);
  const [calificacion, setCalificacion] = useState('');
  const [productos, setProductos] = useState([]);

  const retrieveData = async () => {
    try {
      const storedIngresos = await AsyncStorage.getItem('ingresos');
      const storedEgresos = await AsyncStorage.getItem('egresos');

      const ingresosArray = storedIngresos ? JSON.parse(storedIngresos) : [];
      const egresosArray = storedEgresos ? JSON.parse(storedEgresos) : [];

      const totalIngresos = ingresosArray.reduce((sum, item) => sum + parseFloat(item.monto), 0);
      const totalEgresos = egresosArray.reduce((sum, item) => sum + parseFloat(item.monto), 0);

      setIngresos(totalIngresos);
      setEgresos(totalEgresos);

      const disponibilidad = ((totalIngresos - totalEgresos) / totalIngresos) * 100;
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
        console.log(disponibilidad);
        setCalificacion('Riesgo Alto');
        setProductos(['Apertura de cuenta']);
      } else if (disponibilidad >= 20 && disponibilidad <= 40) {
        console.log(disponibilidad);
        setCalificacion('Riesgo Suficiente');
        setProductos(['Apertura de cuenta', 'Tarjeta de Crédito Clásica', 'Crédito personal hasta $8,000.00']);
      } else {
        console.log(disponibilidad);
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

  return (
    <View style={styles.container}>
      <Text>Total Ingresos: {ingresos}</Text>
      <Text>Total Egresos: {egresos}</Text>
      <Text>Calificación de Riesgo: {calificacion}</Text>
      <Text>Productos sugeridos:</Text>
      {productos.map((producto, index) => (
        <Text key={index}>- {producto}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  }
});
