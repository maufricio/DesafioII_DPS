import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import Icon from 'react-native-vector-icons/MaterialIcons';


const validationSchema = Yup.object().shape({
  fuenteIngreso: Yup.string()
    .oneOf(
      ['Salario', 'Negocio Propio', 'Pensiones', 'Remesas', 'Ingresos Varios'],
      'Por favor selecciona una opción válida.'
    )
    .required('Por favor selecciona una opción válida de los ingresos.'),
  monto: Yup.number()
    .required('El monto es obligatorio')
    .min(0, 'El monto debe ser mayor o igual a 0')
});
//Ocultar el teclado
const cerrarTeclado = () => {
  Keyboard.dismiss();
}
const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log("AsyncStorage borrado");
  } catch (error) {
    console.error('Error al limpiar datos:', error);
  }
}



export default function FormIngresos({ update }) {
  const [ingresos, setIngresos] = useState([]);

  //console.log(cita);

  // Función para almacenar los datos
  const storeData = async (newIngreso) => {
    try {
      newIngreso.id = uuidv4()
      const storedIngresos = await AsyncStorage.getItem('ingresos');
      const ingresosArray = storedIngresos ? JSON.parse(storedIngresos) : [];
      const updatedIngresos = [...ingresosArray, newIngreso];

      // Guardar en AsyncStorage
      await AsyncStorage.setItem('ingresos', JSON.stringify(updatedIngresos));

      // Actualizar el estado local
      setIngresos(updatedIngresos);
      update(() => retrieveData());
    } catch (error) {
      console.error('Error al almacenar datos:', error);
    }
  };

  const deleteData = async (id) => {
    try {
      const storedIngresos = await AsyncStorage.getItem('ingresos');
      const ingresosArray = storedIngresos ? JSON.parse(storedIngresos) : []; //Si existe algo dentro de storedIngresos, entonces parsear a JSON lo cual es un array, si no, entonces es un array vacío
      const updatedIngresos = ingresosArray.filter((ingreso) => ingreso.id !== id);

      // Guardar en AsyncStorage
      await AsyncStorage.setItem('ingresos', JSON.stringify(updatedIngresos));

      // Actualizar el estado local
      setIngresos(updatedIngresos);
      update(() => retrieveData());
    } catch (error) {
      console.error('Error al modificar datos:', error);
    }
  }

  // Para mostrar los datos almacenados
  useEffect(() => {
    const retrieveData = async () => {
      try {
        const storedIngresos = await AsyncStorage.getItem('ingresos');
        if (storedIngresos) {
          setIngresos(JSON.parse(storedIngresos))
          console.log("Ingresos recuperados:", JSON.parse(storedIngresos));
        }

      } catch (error) {
        console.error('Error al recuperar datos:', error);
      }
    };

    retrieveData(); // Al montar el componente, obtener los datos
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
              fuenteIngreso: '',
              monto: ''
            }}
            validationSchema={validationSchema}
            onSubmit={(values, {resetForm}) => {
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
                  selectedValue={values.fuenteIngreso}
                  onValueChange={(itemValue) => setFieldValue('fuenteIngreso', itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Selecciona un tipo de ingreso" value="" />
                  <Picker.Item label="Salario" value="Salario" />
                  <Picker.Item label="Negocio Propio" value="Negocio Propio" />
                  <Picker.Item label="Pensiones" value="Pensiones" />
                  <Picker.Item label="Remesas" value="Remesas" />
                  <Picker.Item label="Ingresos Varios" value="Ingresos Varios" />
                </Picker>
                <ErrorMessage name="tipoIngreso" component={Text} style={styles.error} />
                <View style={styles.formGroup}>
                  <View style={styles.header}>
                    <Icon name="attach-money" size={20} color="black" style={styles.icon} />
                    <Text style={styles.formLabel}>Ingrese el monto</Text>
                  </View>

                  {/* Campo para el monto */}
                  <TextInput
                    name="monto"  // Agrega el atributo name
                    value={values.monto}
                    onChangeText={handleChange('monto')}  // Asegura que esté enlazado correctamente
                    onBlur={handleBlur('monto')}
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
                    <Text style={styles.text}>{item.fuenteIngreso}</Text>
                    <Text style={styles.text}>${item.monto}</Text>
                    <TouchableOpacity style={styles.buttonDelete} onPress={() => deleteData(item.id)}>
                      <Icon name="delete" size={15} color="black" style={styles.icon} />
                      <Text style={styles.buttonTextDelete}>Eliminar</Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()} // Assuming each item has a unique 'id' property
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