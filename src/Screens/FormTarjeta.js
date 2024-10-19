import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

export default function Formulario() {
  const [hasPermission, setHasPermission] = useState(null);
  const [selfieUri, setSelfieUri] = useState(null);
  const [carnetUri, setCarnetUri] = useState(null);
  const [selfieBase64, setSelfieBase64] = useState(null);
  const [carnetBase64, setCarnetBase64] = useState(null);
  const [detalleProducto, setDetalleProducto] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [idNotificacion, setIdNotificacion] = useState('');

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
    setHasPermission(status === 'granted' && mediaLibraryStatus.status === 'granted');
  };

  const takeSelfie = async () => {
    if (hasPermission) {
      const cameraRef = await Camera.takePictureAsync();
      setSelfieUri(cameraRef.uri);
      const base64Selfie = await FileSystem.readAsStringAsync(cameraRef.uri, { encoding: 'base64' });
      setSelfieBase64(base64Selfie);
    }
  };

  const takeCarnet = async () => {
    if (hasPermission) {
      const cameraRef = await Camera.takePictureAsync();
      setCarnetUri(cameraRef.uri);
      const base64Carnet = await FileSystem.readAsStringAsync(cameraRef.uri, { encoding: 'base64' });
      setCarnetBase64(base64Carnet);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = {
        detalleProducto,
        nombreCompleto,
        direccion,
        telefono,
        idNotificacion,
        selfie: selfieBase64,
        carnet: carnetBase64,
      };

      const response = await axios.post('https://api.tu-servidor.com/formulario', formData);
      console.log('Datos enviados correctamente', response.data);
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
      <TextInput
        placeholder="ID Notificación"
        value={idNotificacion}
        onChangeText={setIdNotificacion}
        style={styles.input}
      />

      <Button title="Tomar Selfie" onPress={takeSelfie} />
      {selfieUri && <Image source={{ uri: selfieUri }} style={styles.image} />}
      
      <Button title="Tomar Foto del Carnet" onPress={takeCarnet} />
      {carnetUri && <Image source={{ uri: carnetUri }} style={styles.image} />}

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
