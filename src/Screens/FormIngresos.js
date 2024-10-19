import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import 'react-native-get-random-values';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Data from "../Conection/Data"

const url_list = Data + '/listingreso'
const url_add = Data + '/addingreso'
const url_delete = Data + '/deleteingreso'

const validationSchema = Yup.object().shape({
  Tipo_ingreso: Yup.string()
    .oneOf(
      ['Salario', 'Negocio Propio', 'Pensiones', 'Remesas', 'Ingresos Varios'],
      'Por favor selecciona una opción válida.'
    )
    .required('Por favor selecciona una opción válida de los ingresos.'),
  Monto: Yup.number()
    .required('El monto es obligatorio')
    .min(0.01, 'El monto debe ser mayor a 0')
});
//Ocultar el teclado
const cerrarTeclado = () => {
  Keyboard.dismiss();
}

export default function FormIngresos() {
  const [ingresos, setIngresos] = useState([]);

  //funcion para listar los datos
  const getData = async () => {
    try {
      const response = await fetch(url_list);
      const data = await response.json();
      setIngresos(data);
      console.log("Ingresos recuperados:", data);
    } catch (error) {
      console.error('Error al recuperar datos:', error);
    }
  }

  // Función para almacenar los datos
  const storeData = async (newIngreso) => {
    try {
      const response = await fetch(url_add, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIngreso),
      });

      if (!response.ok) throw new Error('Error al agregar ingreso');

      const addedIngreso = await response.json();
      setIngresos((prevIngresos) => [...prevIngresos, addedIngreso]);
      getData()
    } catch (error) {
      console.error('Error al almacenar datos:', error);
    }
  };

  const deleteData = async (_id) => {
    try {
      const response = await fetch(`${url_delete}/${_id}`, { method: 'DELETE' });

      if (!response.ok) throw new Error('Error al eliminar ingreso');

      setIngresos((prevIngresos) => prevIngresos.filter((ingreso) => ingreso._id !== _id));
      getData();
    } catch (error) {
      console.error('Error al modificar datos:', error);
    }
  };

  // Para mostrar los datos almacenados
  useEffect(() => {
    getData(); // Al montar el componente, obtener los datos
  }, []);

  return (
    <>
      <TouchableWithoutFeedback onPress={() => cerrarTeclado()}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Icon name="add-card" size={30} color="black" style={styles.icon} />
            <Text style={styles.title}>Formulario de Ingresos</Text>
          </View>
          <Formik
            initialValues={{
              Tipo_ingreso: '',
              Monto: ''
            }}
            validationSchema={validationSchema}
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
                  <Text style={{ fontSize: 15 }}>Tipo de Ingreso</Text>
                </View>
                <Picker
                  selectedValue={values.Tipo_ingreso}
                  onValueChange={(itemValue) => setFieldValue('Tipo_ingreso', itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecciona un tipo de ingreso" value="" />
                  <Picker.Item label="Salario" value="Salario" />
                  <Picker.Item label="Negocio Propio" value="Negocio Propio" />
                  <Picker.Item label="Pensiones" value="Pensiones" />
                  <Picker.Item label="Remesas" value="Remesas" />
                  <Picker.Item label="Ingresos Varios" value="Ingresos Varios" />
                </Picker>
                <ErrorMessage name="Tipo_ingreso" component={Text} style={styles.error} />
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
                  <ErrorMessage name="monto" component={Text} style={styles.error} />
                  <ErrorMessage name="fuenteIngreso" component={Text} style={styles.error} />
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

            {ingresos.length > 0 ? (
              <FlatList
                style={styles.dataIncome}
                data={ingresos}
                renderItem={({ item }) => (
                  <View style={styles.containerIngresos}>
                    <Text style={styles.text}>{item.Tipo_ingreso}</Text>
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
    marginVertical: 10
  },
  form: {
    marginBottom: 20
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8
  },
  error: {
    color: 'red',
    marginBottom: 10
  },
  picker: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },

  containerIngresos: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
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
  },
});