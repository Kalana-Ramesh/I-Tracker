import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from '../stats/styles';
import { Trash } from '../stats/imports';

const Date = ({ date, deleteFunc }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{date[0]}</Text>
            <TouchableOpacity onPress={() => deleteFunc(date[0])}>
                <Image
                    source={Trash}
                    style={styles.image}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: scale(5),
        marginLeft: scale(5),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(3),

    },
    text: {
        color: 'rgba(0,0,0.0980392,0.3)',
        fontWeight: 'bold',
        letterSpacing: scale(3)
    },
    image: {
        width: scale(25),
        height: 25,
        marginLeft: scale(10)
    }
})

export default Date;
