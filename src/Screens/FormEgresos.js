import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { v4 as uuidv4 } from 'uuid';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Data from "../Conection/Data"

const url_list = Data + '/listegreso'
const url_add = Data + '/addegreso'
const url_delete = Data + '/deleteegreso'

// Esquema de validación con Yup
const EgresoSchema = Yup.object().shape({
  Tipo_egreso: Yup.string()
    .oneOf([
      'Alquiler/Hipoteca',
      'Canasta Básica',
      'Financiamientos',
      'Transporte',
      'Servicios públicos',
      'Salud y Seguro',
      'Egresos Varios'
    ])
    .required('El tipo de egreso es obligatorio'),
  Monto: Yup.number()
    .positive('El monto debe ser un número positivo')
    .required('El monto es obligatorio')
    .min(0.01, 'El monto debe ser mayor a 0')
});

//Ocultar el teclado
const cerrarTeclado = () => {
  Keyboard.dismiss();
}

export default function Egresos() {
  const [egresos, setEgresos] = useState([]);

  //funcion para listar los datos
  const getData = async () => {
    try {
      const response = await fetch(url_list);
      const data = await response.json();
      setEgresos(data);
      console.log("Egresos recuperados:", data);
    } catch (error) {
      console.error('Error al recuperar datos:', error);
    }
  }

  // Función para almacenar los datos
  const storeData = async (newEgreso) => {
    try {
      const response = await fetch(url_add, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEgreso),
      });

      if (!response.ok) throw new Error('Error al agregar egreso');

      const addedEgreso = await response.json();
      setEgresos((prevEgresos) => [...prevEgresos, addedEgreso]);
      getData()
    } catch (error) {
      console.error('Error al almacenar datos:', error);
    }
  };

  const deleteData = async (_id) => {
    try {
      const response = await fetch(`${url_delete}/${_id}`, { method: 'DELETE' });

      if (!response.ok) throw new Error('Error al eliminar egreso');

      setEgresos((prevEgresos) => prevEgresos.filter((egreso) => egreso._id !== _id));
      getData();
    } catch (error) {
      console.error('Error al modificar datos:', error);
    }
  };

  useEffect(() => {
    getData(); // Al montar el componente, obtener los datos
  }, []);


  return (
    <>
      <TouchableWithoutFeedback onPress={() => cerrarTeclado()}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Icon name="credit-score" size={30} color="black" style={styles.icon} />
            <Text style={styles.title}>Formulario de Egresos</Text>
          </View>
          <Formik
            initialValues={{
              Tipo_egreso: '',
              Monto: ''
            }}
            validationSchema={EgresoSchema}
            onSubmit={(values, { resetForm }) => {
              console.log(values); // Imprime los valores en formato JavaScript
              storeData(values);
              resetForm();
            }}
          >
            {({ handleSubmit, handleChange, handleBlur, setFieldValue, values }) => (
              <View style={styles.form}>
                <View style={styles.header}>
                  <Icon name="play-arrow" size={20} color="black" style={styles.icon} />
                  <Text style={{ fontSize: 15 }}>Tipo de Egreso</Text>
                </View>
                <Picker
                  selectedValue={values.Tipo_egreso}
                  onValueChange={(itemValue) => setFieldValue('Tipo_egreso', itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecciona un tipo de ingreso" value="" />
                  <Picker.Item label="Alquiler/Hipoteca" value="Alquiler/Hipoteca" />
                  <Picker.Item label="Canasta Básica" value="Canasta Básica" />
                  <Picker.Item label="Financiamientos" value="Financiamientos" />
                  <Picker.Item label="Transporte" value="Transporte" />
                  <Picker.Item label="Servicios públicos" value="Servicios públicos" />
                  <Picker.Item label="Salud y Seguro" value="Salud y Seguro" />
                  <Picker.Item label="Egresos Varios" value="Egresos Varios" />
                </Picker>
                <ErrorMessage name="Tipo_egreso" component={Text} style={styles.error} />
                <View style={styles.formGroup}>
                  <View style={styles.header}>
                    <Icon name="attach-money" size={20} color="black" style={styles.icon} />
                    <Text style={styles.formLabel}>Ingrese el monto</Text>
                  </View>

                  {/* Campo para el monto */}
                  <TextInput
                    name="Monto"  // Agrega el atributo name
                    value={values.Monto}
                    onChangeText={handleChange('Monto')}  // Asegura que esté enlazado correctamente
                    onBlur={handleBlur('Monto')}
                    keyboardType="numeric"
                    style={styles.input}
                    placeholder="Ingrese monto"
                  />
                  <ErrorMessage name="Monto" component={Text} style={styles.error} />
                  <ErrorMessage name="Tipo_egreso" component={Text} style={styles.error} />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Icon name="save" size={24} color="black" style={styles.icon} />
                  <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          {/* Mostrar los datos almacenados */}
          <View style={styles.dataContainer}>

            {egresos.length > 0 ? (
              <FlatList
                style={styles.dataIncome}
                data={egresos}
                renderItem={({ item }) => (
                  <View style={styles.containerIngresos}>
                    <Text style={styles.text}>{item.Tipo_egreso}</Text>
                    <Text style={styles.text}>${item.Monto}</Text>
                    <TouchableOpacity style={styles.buttonDelete} onPress={() => deleteData(item._id)}>
                      <Icon name="delete" size={15} color="black" style={styles.icon} />
                      <Text style={styles.buttonTextDelete}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />

            ) : (
              <Text>No se han ingresado datos aún...</Text>
            )}
          </View>


        </View>
      </TouchableWithoutFeedback>
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
  }, containerIngresos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginRight: 8
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#20FF59',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: 'black',
    fontSize: 16
  },
  buttonTextDelete: {
    color: 'black',
    fontSize: 10
  },
  buttonDelete: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9090',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  }
});