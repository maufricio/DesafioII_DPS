import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ScrollView, Dimensions } from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
const data = [
  {
    name: "Ingresos",
    population: 1000,
    color: "#FF7B7B",
    legendFontColor: "#000000",
    legendFontSize: 20
  }, {

    name: "Egresos",
    population: 600,
    color: "#9BFF7B",
    legendFontColor: "#000000",
    legendFontSize: 20

  }
]

const data2 = {
  labels: [""], // optional
  data: [0.7]
};

const configchart = {
  backgroundGradientFrom: "#632E2E",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#08130D",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
}

const configchart2 = {
  backgroundGradientFrom: "#C1C1C1",
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "#FFFFFF",
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(37, 63, 255, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false // optional
}


const Grafica = () => {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Grafica Ingresos vs Egresos</Text>
        <PieChart
          data={data}
          width={screenWidth}
          height={220}
          chartConfig={configchart}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"0"}
          center={[10, 10]}
          absolute
        />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>¡Tu porcentaje de ingresos!</Text>
        <ProgressChart
          data={data2}
          width={screenWidth}
          height={220}
          strokeWidth={15}
          radius={80}
          chartConfig={configchart2}
          hideLegend={false}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
    textAlign: "center"
  }
})

export default Grafica