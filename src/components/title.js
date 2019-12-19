import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scale, verticalScale } from '../stats/styles';

export default function Title({ title }) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginLeft: scale(5),
        marginTop: scale(5),
        marginBottom: scale(5)
    },

    text: {
        fontWeight: 'bold',
        color: 'rgba(0,0,0.0980392,0.3)',
        fontSize: scale(12),
        textTransform: 'capitalize',
    }
});
