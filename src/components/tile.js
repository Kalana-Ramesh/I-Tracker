import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { scale, verticalScale, colors } from '../stats/styles';
import { TileBackground, HeaderBackground } from '../stats/imports';

export default function tile({ dataSet, openModal }) {

    let results = dataSet.adress.results;
    let time = dataSet.dateObject.time;
    let split = time.split(':');
    let formattedTime = split[0] + ":" + split[1];

    let location = results[0].formatted_address;

    if (location === "Unnamed Road, Sri Lanka") {
        location = results[1].formatted_address;
    }

    return (
        <ImageBackground
            source={TileBackground}
            style={styles.container}
            imageStyle={{ borderRadius: 15 }}
        >
            <TouchableOpacity
                onPress={() => openModal(dataSet)}
                style={styles.button}>
                <View style={styles.topContainer}>
                    <Text style={styles.textDateTime}>{formattedTime}</Text>
                </View>
                <Text style={styles.textLocation}>{location}</Text>
            </TouchableOpacity>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: scale(190),
        borderRadius: 10,
        marginBottom: scale(15),
        marginHorizontal: scale(10),
        shadowOffset: { width: 10, height: 10 },
        shadowColor: 'black',
        shadowOpacity: 1,
        elevation: 10,
        height: verticalScale(120),
        overflow: 'hidden',
    },
    topContainer: {
        flexDirection: 'row-reverse',
        margin: scale(5)
    },

    textDateTime: {
        color: 'white',
        padding: scale(3),
        borderRadius: 5,
        marginLeft: scale(5),
        textAlign: 'center'
    },
    textLocation: {
        color: 'white',
        fontSize: scale(12),
        letterSpacing: 2,
        paddingHorizontal: scale(2)
    },
    button: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)'
    }
});
