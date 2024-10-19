import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import CameraComponent from './CameraComponent';
import CameraCarnet from './CameraCarnet';


export default function Formulario() {
  const [detalleProducto, setDetalleProducto] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [selfiePhoto, setSelfiePhoto] = useState();
  const [carnetPhoto, setCarnetPhoto] = useState();

  

  const handleSubmit = async () => {
    try {
      const formData = {
        Nombre_producto: detalleProducto,
        Nombre_usuario: nombreCompleto,
        Direccion: direccion,
        Telefono: telefono,
        Foto_rostro: null,
        Foto_carnet: null,
        status: false,
      };  
      const response = await axios.post('https://api-banco-ssrm.onrender.com/api/addusuario', formData);
      console.log('Datos enviados correctamente', response.data);
      Alert.alert("Datos enviados correctamente");
    } catch (error) {
      console.error('Error al enviar los datos', error);
    }
  };



  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Detalle del Producto"
        value={detalleProducto}
        onChangeText={setDetalleProducto}
        style={styles.input}
      />
      <TextInput
        placeholder="Nombre Completo"
        value={nombreCompleto}
        onChangeText={setNombreCompleto}
        style={styles.input}
      />
      <TextInput
        placeholder="Dirección"
        value={direccion}
        onChangeText={setDireccion}
        style={styles.input}
      />
      <TextInput
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="numeric"
        style={styles.input}
      />
  <Text>Tomar foto selfie de mí</Text>
  <CameraComponent photo={selfiePhoto} setPhoto={setSelfiePhoto} />
    
     

  <Text>Tomar foto de mi carnet</Text>
  <CameraCarnet photo={carnetPhoto} setPhoto={setCarnetPhoto}/>


      <Button title="Enviar Datos" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});
