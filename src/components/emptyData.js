import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Empty } from '../stats/imports';
import { scale, verticalScale, colors } from '../stats/styles';
import Tile from './tile';

export default function emptyData({ refresh }) {
    return (
        <View style={styles.container}>
            <Image
                source={Empty}
                style={styles.image}
            />
            <Text style={styles.text}> no previous details available</Text>
            <TouchableOpacity
                onPress={() => refresh()}
                style={styles.button}>
                <Text style={styles.buttonText}>refresh</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: scale(20),
        // backgroundColor: colors.transparentWhite
    },
    text: {
        //textAlign: 'çenter',
        fontSize: scale(11),
        letterSpacing: scale(2),
        textTransform: 'capitalize'
    },
    image: {
        width: scale(54),
        height: verticalScale(54)
    },
    button: {
        //flex: 1,
        width: scale(80),
        //height: verticalScale(40),
        borderRadius: 5,
        alignItems: 'center',
        //justifyContent: 'center',
        margin: scale(10),
        borderWidth: scale(1),
        backgroundColor: colors.transparentBlack
    },
    buttonText: {
        textTransform: 'capitalize',
        fontSize: scale(11),
        color: colors.white,
        letterSpacing: scale(2),
        margin: scale(2)
    }
});