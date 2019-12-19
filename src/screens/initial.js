import React, { useState } from 'react'
import {
    View,
    TextInput,
    ImageBackground,
    StatusBar,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import { InitialBackground } from '../stats/imports';
import { ContextConsumer } from '../context/context';
import { scale, verticalScale, goldColor, colors } from '../stats/styles';
import { Logo, Next } from '../stats/imports';
import Fade from '../components/animations/fade';

export default function initial({ navigation }) {

    const [mobile, setMobile] = useState('');

    return (

        <ContextConsumer>
            {(context) => {
                const { userData, handleLogin } = context;
                return (
                    <KeyboardAvoidingView
                        style={styles.container}
                        behavior="height"
                        enabled

                    >
                        <StatusBar backgroundColor={colors.black} />
                        <ImageBackground
                            style={{ width: scale(350), height: verticalScale(680) }}
                            source={InitialBackground}
                        >
                            <View style={styles.container}>
                                <Fade
                                    initial={0}
                                    toValue={1}
                                    duration={3000}
                                >
                                    <View style={styles.topContainer}>
                                        <Image
                                            source={Logo}
                                            style={styles.iconLogo}
                                        />
                                        <Text
                                            style={styles.textTitle}>I-Tracker</Text>
                                        <Text
                                            style={styles.textSubTitle}>Offline location tracker</Text>
                                    </View>
                                </Fade>
                                <Fade
                                    initial={0}
                                    toValue={1}
                                    duration={3000}
                                >
                                    <View style={styles.bottomContainer}>
                                        {
                                            (userData.length === 0) || (!userData[0].loginState) ?
                                                <TextInput
                                                    onChangeText={(text) => setMobile(text)}
                                                    placeholder="Mobile"
                                                    placeholderTextColor={colors.transparentWhite}
                                                    keyboardType='number-pad'
                                                    style={styles.textInput}
                                                />
                                                : null
                                        }
                                        <TouchableOpacity
                                            onPress={() => handleLogin(navigation, mobile)}
                                            style={{ alignItems: 'center' }}>
                                            <View style={styles.button}>
                                                <Image
                                                    source={Next}
                                                    style={styles.iconNext}
                                                />
                                                <Text style={styles.textButton}>Go</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </Fade>
                            </View>
                        </ImageBackground>
                    </KeyboardAvoidingView>
                );
            }}
        </ContextConsumer>


    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'space-around'
    },
    topContainer: {
        alignItems: 'center',
        marginTop: scale(20)
    },

    iconLogo: {
        width: scale(80),
        height: verticalScale(80)
    },

    textTitle: {
        color: goldColor,
        fontSize: scale(60),
        fontWeight: 'bold',
    },

    textSubTitle: {
        color: 'white',
        fontSize: scale(11),
        textTransform: 'capitalize',
        letterSpacing: scale(4)
    },

    bottomContainer: {
        alignItems: 'center'
    },

    textInput: {
        width: scale(200),
        height: verticalScale(40),
        borderBottomWidth: scale(1),
        borderColor: colors.white,
        marginBottom: scale(15),
        color: "rgba(255,255,255,0.7)",
        fontWeight: 'bold',
        letterSpacing: 2
    },
    button: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        width: scale(250),
        height: verticalScale(50),
        borderRadius: 50,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        borderColor: goldColor,
        borderWidth: scale(0.4)
    },

    textButton: {
        fontWeight: 'bold',
        color: colors.white,
        fontSize: scale(20),
        marginRight: scale(80),
        letterSpacing: scale(2),
        textTransform: 'uppercase'
    },

    iconNext: {
        width: scale(50),
        height: verticalScale(50)
    }
})