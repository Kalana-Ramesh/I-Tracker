import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ImageBackground
} from 'react-native';
import { scale, verticalScale, colors } from '../stats/styles';
import { ButtonPin, TileBackground } from '../stats/imports';
import { ContextConsumer } from '../context/context';
import Btn from './button';

export default function Activity() {

    const [minutes, setminutes] = useState('');
    return (
        <ContextConsumer>
            {(context) => {
                const { getCurrentPossition, startTracking } = context;
                console.log('StartTracking:', startTracking);
                return (
                    <ImageBackground
                        source={TileBackground}
                        style={styles.backgrounbContainer}
                        imageStyle={{ borderRadius: 15 }}
                    >
                        <View style={styles.container}>
                            <View style={styles.topContainer}>
                                <Text style={styles.textTop}>Track me every</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={minutes}
                                    keyboardType='number-pad'
                                    onChangeText={(text) => setminutes(text)}
                                    placeholder="eg:10"
                                />
                                <Text style={styles.textTop} >
                                    {
                                        parseInt(minutes) === 1 ? "minute" : "minutes"
                                    }
                                </Text>
                            </View>
                            {
                                (!startTracking) ?
                                    <View style={{ alignItems: 'center' }}>
                                        <Btn
                                            condition={startTracking}
                                            textColor={colors.white}
                                            image={ButtonPin}
                                            title="Track Me"
                                            onPress={getCurrentPossition}
                                            params={{ p1: startTracking, p2: minutes }}
                                        />
                                        <Text style={styles.textStart}>Start Tracking</Text>
                                    </View>

                                    : <View style={{ alignItems: 'center' }}>
                                        <Btn
                                            condition={startTracking}
                                            textColor={colors.red}
                                            image={ButtonPin}
                                            title="STOP"
                                            onPress={getCurrentPossition}
                                            params={{ p1: startTracking, p2: minutes }}
                                        />
                                        <Text style={styles.textStop}>Stop Tracking</Text>
                                    </View>
                            }
                        </View>
                    </ImageBackground>
                );
            }}
        </ContextConsumer>
    )
}

const styles = StyleSheet.create({
    backgrounbContainer: {
        flex: 1,
        //width: scale(330),
        borderRadius: 15,
        margin: scale(10),
        shadowOffset: { width: 10, height: 10 },
        shadowColor: 'black',
        shadowOpacity: 1,
        elevation: 10,
        height: verticalScale(200),
        overflow: 'hidden',
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'space-around'
    },

    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    textInput: {
        borderBottomWidth: 1,
        height: verticalScale(30),
        width: scale(60),
        padding: scale(5),
        fontSize: scale(12),
        textAlign: 'center',
        borderColor: '#161B33',
        fontWeight: 'bold',
        //marginLeft: scale(1),
        //marginRight: scale(1)
    },

    textTop: {
        fontSize: scale(12),
        fontWeight: 'bold',
        letterSpacing: scale(1),
        textTransform: 'uppercase'
    },

    textStop: {
        textTransform: 'uppercase',
        letterSpacing: 3,
        fontSize: scale(10),
        margin: scale(2)
    },

    textStart: {
        textTransform: 'uppercase',
        letterSpacing: 3,
        fontSize: scale(10),
        margin: scale(2)
    }

});




