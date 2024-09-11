import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import shortid from 'react-id-generator';

const validationSchema = Yup.object().shape({
  fuenteIngreso: Yup.string()
    .oneOf(
      ['Salario', 'Negocio Propio', 'Pensiones', 'Remesas', 'Ingresos Varios'],
      'Por favor selecciona una opción válida.'
    )
    .required('Este campo es obligatorio'),
    monto: Yup.number()
      .required('El monto es obligatorio')
      .min(0, 'El monto debe ser mayor o igual a 0')
});

export default function FormIngresos() {
  const [ingresos, setIngresos] = useState([]);

 // Función para almacenar los datos
const storeData = async (newIngreso) => {
  try {
    const storedIngresos = await AsyncStorage.getItem('ingresos');
    const ingresosArray = storedIngresos ? JSON.parse(storedIngresos) : [];
    const updatedIngresos = [...ingresosArray, newIngreso];

    // Guardar en AsyncStorage
    await AsyncStorage.setItem('ingresos', JSON.stringify(updatedIngresos));

    // Actualizar el estado local
    setIngresos(updatedIngresos);
  } catch (error) {
    console.error('Error al almacenar datos:', error);
  }
};

// Para mostrar los datos almacenados
useEffect(() => {
  const retrieveData = async () => {
    try {
      const storedIngresos = await AsyncStorage.getItem('ingresos');
      if (storedIngresos) {
        setIngresos(JSON.parse(storedIngresos));
      }
    } catch (error) {
      console.error('Error al recuperar datos:', error);
    }
  };

  retrieveData(); // Al montar el componente, obtener los datos
}, []);

  return (
    <>
      <View style = {styles.container}>
        <Text style = {styles.title}>Formulario de Ingresos</Text>
        
            <Formik
            initialValues={{
              fuenteIngreso: '',
              monto: ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { resetForm }) => {
              storeData(values);
            }}
            >
        {({ handleSubmit, setFieldValue, values }) => (
          <View style={styles.form}>
            <Text>Tipo de Ingreso</Text>
            <Picker
              selectedValue={values.tipoIngreso}
              onValueChange={(itemValue) => setFieldValue('tipoIngreso', itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona un tipo de egreso" value="" />
              <Picker.Item label="Salario" value="Salario" />
              <Picker.Item label="Negocio Propio" value="Negocio Propio" />
              <Picker.Item label="Pensiones" value="Pensiones" />
              <Picker.Item label="Remesas" value="Remesas" />
              <Picker.Item label="Ingresos Varios" value="Ingresos Varios" />
            </Picker>
            <ErrorMessage name="tipoIngreso" component={Text} style={styles.error} />
            <View style={styles.formGroup}>
      <Text style={styles.formLabel}>Monto</Text>
      <Field name="monto">
        {({ field, form }) => (
          <TextInput
            {...field}
            keyboardType="numeric"
            style={styles.formInput}
            placeholder="Ingrese monto"
          />
        )}
      </Field>
      <ErrorMessage name="monto">
        {msg => <Text style={styles.formError}>{msg}</Text>}
      </ErrorMessage>
    </View>

      <Button onPress={handleSubmit} title="Submit" />
          </View>
        )}
      </Formik>

      {/* Mostrar los datos almacenados */}
      <View style={styles.dataContainer}>
        <Text style={styles.dataTitle}>Datos Ingresados</Text>
        {ingresos ? (
          <>
            <Text>Tipo de Ingreso: {ingresos.tipoIngreso}</Text>
            <Text>Monto: {ingresos.monto}</Text>
          </>
        ) : (
          <Text>No se han ingresado datos aún</Text>
        )}
      </View>


      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
  },
  form: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  editButton: {
    color: 'blue',
    marginTop: 10,
  },
  deleteButton: {
    color: 'red',
    marginTop: 5,
  },
});