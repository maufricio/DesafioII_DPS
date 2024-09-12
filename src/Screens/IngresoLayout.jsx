import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const IngresoLayout = (income) => {
  return (
    <View>
      <Text style = {styles.text}>{income.fuenteIngreso}</Text>
      <Text style = {styles.text}>${income.monto}</Text>
    </View>
  )
}

export default IngresoLayout

const styles = StyleSheet.create({
    text: {

    }
})