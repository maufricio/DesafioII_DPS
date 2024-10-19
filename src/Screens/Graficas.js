import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { ProgressChart } from "react-native-chart-kit";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Data from "../Conection/Data";

const screenWidth = Dimensions.get("window").width;
const url_data_ingreso = Data + '/listingreso';
const url_data_egreso = Data + '/listegreso';

const Grafica = () => {
  const [data2, setData2] = useState({
    labels: [""],
    data: [0]
  });

  const [hasData, setHasData] = useState(false);
  const [refresh, setRefresh] = useState(false);

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

  const fetchData = async () => {
    try {
      const ingresosResponse = await fetch(`${url_data_ingreso}?timestamp=${new Date().getTime()}`);
      const egresosResponse = await fetch(`${url_data_egreso}?timestamp=${new Date().getTime()}`);

      const ingresosArray = await ingresosResponse.json();
      const egresosArray = await egresosResponse.json();

      console.log("Ingresos:", ingresosArray);
      console.log("Egresos:", egresosArray);

      const totalIngresos = ingresosArray.reduce((sum, item) => sum + parseFloat(item.Monto), 0);
      const totalEgresos = egresosArray.reduce((sum, item) => sum + parseFloat(item.Monto), 0);

      const disponibilidad = totalIngresos > 0 ? (totalIngresos - totalEgresos) / totalIngresos : 0;

      setData2({
        labels: [""],
        data: [disponibilidad > 0 ? disponibilidad : 0]
      });

      setHasData(disponibilidad > 0);

    } catch (error) {
      console.error('Error al recuperar datos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(); // Llama a fetchData cada cierto tiempo para actualizar datos
    }, 500000); // Por ejemplo, cada 5 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, []);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  console.log("Datos en data2:", data2);

  return (
    <>
      {hasData ? (
        <View style={styles.container}>
          <View style={styles.header2}>
            <Icon name="local-atm" size={30} color="black" style={styles.icon} />
            <Text style={styles.title}>¡Tu disponibilidad de ingresos!</Text>
            <Icon name="refresh" size={30} color="black" style={styles.icon} onPress={handleRefresh} />
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
  icon: {
    marginRight: 8
  },
  header2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 0
  }
});

export default Grafica;
