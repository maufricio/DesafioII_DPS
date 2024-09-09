import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

// Esquema de validación con Yup
const EgresoSchema = Yup.object().shape({
  tipoEgreso: Yup.string()
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
  monto: Yup.number()
    .positive('El monto debe ser un número positivo')
    .required('El monto es obligatorio'),
});

export default function Egresos() {
  const [egresos, setEgresos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    const fetchEgresos = async () => {
      try {
        const storedEgresos = await AsyncStorage.getItem('egresos');
        const egresosArray = storedEgresos ? JSON.parse(storedEgresos) : [];
        setEgresos(egresosArray);
      } catch (error) {
        console.error('Error recuperando los datos:', error);
      }
    };

    fetchEgresos();
  }, []);

  const saveEgreso = async (values) => {
    try {
      const existingEgresos = await AsyncStorage.getItem('egresos');
      const egresosArray = existingEgresos ? JSON.parse(existingEgresos) : [];
      
      if (editIndex !== null) {
        egresosArray[editIndex] = values;
        setEditIndex(null);
      } else {
        egresosArray.push(values);
      }
      
      await AsyncStorage.setItem('egresos', JSON.stringify(egresosArray));
      setEgresos(egresosArray); // Actualiza el estado con los datos nuevos
    } catch (error) {
      console.error('Error guardando los datos:', error);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    try {
      const updatedEgresos = egresos.filter((_, i) => i !== index);
      await AsyncStorage.setItem('egresos', JSON.stringify(updatedEgresos));
      setEgresos(updatedEgresos);
    } catch (error) {
      console.error('Error eliminando los datos:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formulario de Egresos</Text>
      <Formik
        initialValues={{
          tipoEgreso: editIndex !== null ? egresos[editIndex]?.tipoEgreso : '',
          monto: editIndex !== null ? egresos[editIndex]?.monto : ''
        }}
        validationSchema={EgresoSchema}
        onSubmit={(values, { resetForm }) => {
          saveEgreso(values);
          resetForm(); // Limpia el formulario después de enviar
        }}
      >
        {({ handleSubmit, setFieldValue, values }) => (
          <View style={styles.form}>
            <Text>Tipo de Egreso</Text>
            <Picker
              selectedValue={values.tipoEgreso}
              onValueChange={(itemValue) => setFieldValue('tipoEgreso', itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Selecciona un tipo de egreso" value="" />
              <Picker.Item label="Alquiler/Hipoteca" value="Alquiler/Hipoteca" />
              <Picker.Item label="Canasta Básica" value="Canasta Básica" />
              <Picker.Item label="Financiamientos" value="Financiamientos" />
              <Picker.Item label="Transporte" value="Transporte" />
              <Picker.Item label="Servicios públicos" value="Servicios públicos" />
              <Picker.Item label="Salud y Seguro" value="Salud y Seguro" />
              <Picker.Item label="Egresos Varios" value="Egresos Varios" />
            </Picker>
            <ErrorMessage name="tipoEgreso" component={Text} style={styles.error} />
            <div className="form-group">
                  <label className="form-label">Monto</label>
                  <Field type="number" name="monto" className="form-input" />
                  <ErrorMessage name="monto" component="div" className="form-error" />
                </div>

            <Button
              title={editIndex !== null ? 'Actualizar' : 'Agregar'}
              onPress={handleSubmit}
            />
          </View>
        )}
      </Formik>

      <Text style={styles.title}>Lista de Egresos</Text>
      <FlatList
        data={egresos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.item}>
            <Text>Tipo: {item.tipoEgreso}</Text>
            <Text>Monto: ${item.monto}</Text>
            <TouchableOpacity onPress={() => handleEdit(index)}>
              <Text style={styles.editButton}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(index)}>
              <Text style={styles.deleteButton}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
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