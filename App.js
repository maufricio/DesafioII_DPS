import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {

  
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
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
