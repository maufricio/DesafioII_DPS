import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, FlatList, RefreshControl } from "react-native";
import Data from "../Conection/Data";

const url = Data + '/listusuario';

const Estado_productos = () => {
    const [productos, setProductos] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = () => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map(item => ({
                    nombre: item.Nombre_producto,
                    estado: item.Status ? "Aceptado" : "en revisión..."
                }));
                setProductos(transformedData);
                setRefreshing(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setRefreshing(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tus solicitudes</Text>
            <FlatList
                data={productos}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.text}>Nombre del producto: {item.nombre}</Text>
                        <Text style={styles.text}>Estado:<Text style={styles.text_status}> {item.estado}</Text></Text>
                    </View>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20
    },
    card: {
        padding: 20,
        borderRadius: 15,
        marginVertical: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 18,
        margin: 5
    },
    text_status: {
        fontSize: 18,
        margin: 5,
        color: "red"
    }
});

export default Estado_productos;
