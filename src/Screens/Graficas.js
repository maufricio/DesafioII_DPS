import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart, ProgressChart } from "react-native-chart-kit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get("window").width;

const Grafica = ({ onDataChange }) => {
  const [data, setData] = useState([
    {
      name: "Ingresos",
      population: 0,
      color: "#FF7B7B",
      legendFontColor: "#000000",
      legendFontSize: 15
    },
    {
      name: "Egresos",
      population: 0,
      color: "#9BFF7B",
      legendFontColor: "#000000",
      legendFontSize: 15
    }
  ]);

  const [data2, setData2] = useState({
    labels: [""],
    data: [0]
  });

  const configchart = {
    backgroundGradientFrom: "#632E2E",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };

  const configchart2 = {
    backgroundGradientFrom: "#C1C1C1",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#FFFFFF",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(37, 63, 255, ${opacity})`,
    strokeWidth: 15,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };

  const retrieveData = async () => {
    try {
      const storedIngresos = await AsyncStorage.getItem('ingresos');
      const storedEgresos = await AsyncStorage.getItem('egresos');

      const ingresosArray = storedIngresos ? JSON.parse(storedIngresos) : [];
      const egresosArray = storedEgresos ? JSON.parse(storedEgresos) : [];

      const totalIngresos = ingresosArray.reduce((sum, item) => sum + parseFloat(item.monto), 0);
      const totalEgresos = egresosArray.reduce((sum, item) => sum + parseFloat(item.monto), 0);

      setData([
        { ...data[0], population: totalIngresos },
        { ...data[1], population: totalEgresos }
      ]);

      const disponibilidad = ((totalIngresos - totalEgresos) / totalIngresos);

      if (disponibilidad > 0) {
        setData2({
          labels: [""],
          data: [disponibilidad]
        });
      }else{
        setData2({
          labels: [""],
          data: [0]
        });
      }
    } catch (error) {
      console.error('Error al recuperar datos:', error);
    }
  };

  useEffect(() => {
    retrieveData();
  }, []);

  // Llama a updateGraphData cuando se recibe la prop onDataChange
  useEffect(() => {
    if (onDataChange) {
      const updateData = async () => {
        await retrieveData(); // Actualiza los datos
        console.log("grafica actualizada");
      };

      updateData();
    }
  }, [onDataChange]);

  const hasData = data.some(item => item.population > 0);

  return (
    <>
      {hasData ? (
        <View style={styles.container}>
          <View style={styles.header}>
            <Icon name="assessment" size={30} color="black" style={styles.icon} />
            <Text style={styles.title}>Gráfica Ingresos vs Egresos</Text>
          </View>
          <PieChart
            data={data}
            width={screenWidth}
            height={220}
            chartConfig={configchart}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"-10"}
            center={[5, 5]}
            absolute
          />
          <View style={styles.legend}>
            {data.map((item) => (
              <View key={item.name} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                <Text>{item.name}: ${item.population.toFixed(2)}</Text>
              </View>
            ))}
          </View>
          <View style={styles.header2}>
            <Icon name="local-atm" size={30} color="black" style={styles.icon} />
            <Text style={styles.title}>¡Tu disponibilidad de ingresos!</Text>
          </View>
          <ProgressChart
            data={data2}
            width={screenWidth}
            height={220}
            strokeWidth={20}
            radius={80}
            chartConfig={configchart2}
            hideLegend={false}
            
          />
        </View>
      ) : (
        <Text>No hay datos que mostrar...</Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
    textAlign: "center"
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  legendColor: {
    width: 20,
    height: 20,
    marginRight: 10
  },
  icon: {
    marginRight: 8
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  header2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 30
  }
});

export default Grafica;