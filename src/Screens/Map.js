import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const Map = () => {
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 13.71607, // Latitud de la Ciudad de México
                    longitude: -89.15451, // Longitud de la Ciudad de México
                    latitudeDelta: 0.0922, // Zoom del mapa
                    longitudeDelta: 0.0421, // Zoom del mapa
                }}
            >
                <Marker
                    coordinate={{ latitude: 13.71607, longitude: -89.15451 }}
                    title={"Universidad Don Bosco"}
                    description={"Soyapango, San Salvador, El Salvador"}
                />
                <Marker
                    coordinate={{ latitude: 13.70682, longitude: -89.21296 }}
                    title={"Metrocentro"}
                    description={"San Salvador, El Salvador"}
                />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
});

export default Map