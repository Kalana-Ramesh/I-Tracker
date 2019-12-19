import React from 'react'
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import { scale, verticalScale, goldColor } from '../stats/styles';
import { HeaderBackground, Dots } from '../stats/imports';
import Fade from './animations/fade';
import { ContextConsumer } from '../context/context';
import MenuModal from './modals/menuModal';

export default function Header({ navigation }) {

    return (
        <ContextConsumer>
            {(context) => {

                const { openMenuModal, menuModalIsOpen, closeMenuModal } = context;

                return (
                    <ImageBackground
                        source={HeaderBackground}
                        style={styles.bckImgContainer}
                    >
                        <View style={styles.container}>
                            <Fade
                                initial={0}
                                toValue={1}
                                duration={5000} >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View>
                                        <Text style={styles.textTitle}>I-Tracker</Text>
                                        <Text style={styles.textSubTitle}>Offline location tracker</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={{
                                            width: scale(40),
                                            height: verticalScale(40),
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                        onPress={() => openMenuModal()}>
                                        <Image
                                            source={Dots}
                                            style={{
                                                width: scale(15),
                                                height: verticalScale(20)
                                            }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </Fade>
                            <MenuModal
                                modalIsOpen={menuModalIsOpen}
                                onClose={closeMenuModal}
                                navigation={navigation}
                            />
                        </View>
                    </ImageBackground>
                );
            }}
        </ContextConsumer>
    );
}

const styles = StyleSheet.create({
    bckImgContainer: {
        height: verticalScale(170)
    },
    container: {
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)',
        height: verticalScale(170),
        shadowOffset: { width: 10, height: 10 },
        shadowColor: 'black',
        shadowOpacity: 1,
        elevation: 10,
        borderBottomColor: goldColor,
        //borderBottomWidth: scale(2),
        padding: scale(20)
    },
    textTitle: {
        color: goldColor,
        fontSize: scale(30),
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 20,
        letterSpacing: scale(4),
        fontWeight: 'bold'
    },
    textSubTitle: {
        color: 'white',
        fontSize: scale(8),
        textTransform: 'capitalize',
        letterSpacing: scale(3)
    },
});