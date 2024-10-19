import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

export default function App() {

  const [usuarios, setUsuarios] = useState([])

  const uri = 'https://api-banco-ssrm.onrender.com/api/listusuario'

  const uri2 = 'https://api-banco-ssrm.onrender.com/api/modifyUsuario/'
  useEffect(() => {
    const getUsuarios = async () => {
      const response = await fetch(uri)
      const data = await response.json()
      setUsuarios(data)
    }
    getUsuarios()
  }, [])


  const actualizarStatus = async (id, nuevoStatus) => {
    try {
        const response = await fetch(`https://api-banco-ssrm.onrender.com/api/modifyUsuario/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: nuevoStatus }), // Manda el nuevo estado
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el estado');
        }

        const data = await response.json();
        console.log('Usuario actualizado:', data);
        // Aquí puedes actualizar el estado de la lista de usuarios si es necesario
    } catch (error) {
        console.error(error);
    }
};


  return (
    <SafeAreaView style={styles.container}>
      <Text>Solicitudes que tengo que aceptar como ADMINISTRADOR</Text>
        <ScrollView>
        {usuarios.map(usuario => (
          <View key={usuario._id}>
            <View>
            <Text>{usuario.Nombre_producto}</Text>
            <Text>{usuario.Nombre_usuario}</Text>
            <Text>{usuario.Telefono}</Text>
            <Text>{usuario.Direccion}</Text>
            <Text>{usuario.Foto_carnet}</Text>
            <Text>{usuario.Foto_rostro}</Text>
            <Text>{usuario.Status}</Text>
            </View>
            <View>
            <Button
        title="Aceptar"
        onPress={() => actualizarStatus(usuario._id, 'Aceptado')} // Cambia el estado a "Aceptado"
      />
      <Button
        title="Rechazar"
        onPress={() => actualizarStatus(usuario._id, 'Rechazado')} // Cambia el estado a "Rechazado"
      />
            </View>
          </View>
        ))}
        </ScrollView>
      
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
});
