import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Fade from './animations/fade';
import { scale, verticalScale, colors } from '../stats/styles';



export default function connection() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>no internet connection...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
        alignItems: 'center',
        padding: scale(2),

        //borderWidth: scale(1),
        //borderColor: colors.darkBlue
    },
    text: {
        color: colors.white,
        textTransform: 'capitalize',
        //fontWeight: 'bold',
        letterSpacing: scale(5),
        fontSize: scale(10)

    }
})
