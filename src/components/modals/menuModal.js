import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
    Image,
    ImageBackground
} from 'react-native';
import { scale, verticalScale, colors } from '../../stats/styles';
import { BubblesLoader } from 'react-native-indicator';
import { Warning, Logout } from '../../stats/imports';
import { ContextConsumer } from '../../context/context';


const { width, height } = Dimensions.get('window');
const modalHeight = verticalScale(170) / 2.5
const modalWidth = width / 2.5;

export default class MenuModal extends Component {

    state = {
        position: new Animated.Value(this.props.modalIsOpen ? 0 : scale(modalHeight)),
        visibility: this.props.modalIsOpen
    }



    //handle modalIsOpen changes to either open or close popup
    componentWillReceiveProps(nextProps) {
        //isOpen prop changed to true from false
        if (!this.props.modalIsOpen && nextProps.modalIsOpen) {
            this.animatedOpen();
        }
        // modalIsOpen prop changed to false from true
        else if (this.props.modalIsOpen && !nextProps.modalIsOpen) {
            this.animatedClose();
        }
    }

    animatedOpen() {
        //update state first
        this.setState({
            visibility: true,
        }, () => {
            // and slide up
            Animated.timing(
                this.state.position,
                {
                    toValue: 0,  // top Of the screen
                    duration: 600
                }
            ).start();
        });
    }

    animatedClose() {
        // slide down

        Animated.timing(
            this.state.position,
            {
                toValue: modalHeight, // bottom of the screen
                duration: 600
            }
        ).start(() => {
            this.setState({
                visibility: false,
            });
        });
    }


    render() {

        if (!this.state.visibility) {
            return null;
        }

        return (
            <ContextConsumer>
                {(context) => {

                    const { handleLogout, handleDeleteAccount } = context;
                    const { navigation } = this.props;

                    return (
                        <View style={styles.container}>
                            <TouchableWithoutFeedback onPress={this.props.onClose}>
                                <Animated.View style={styles.backDrop} />
                            </TouchableWithoutFeedback>
                            <Animated.View
                                style={[styles.modalContainer, {
                                    // Animates position on the screen
                                    transform: [{ translateY: this.state.position }, { translateX: 0 }]
                                }]}
                            >
                                <View style={{
                                    flex: 1,
                                    justifyContent: 'space-around',

                                    //padding: scale(5),

                                }}>
                                    <TouchableOpacity
                                        onPress={() => handleLogout(navigation)}
                                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image
                                            source={Logout}
                                            style={{ width: scale(20), height: verticalScale(22), marginHorizontal: scale(5) }}
                                        />
                                        <Text style={{
                                            fontSize: scale(12),
                                            textTransform: 'capitalize',
                                            letterSpacing: scale(1)
                                        }}>logout</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleDeleteAccount()}
                                        style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image
                                            source={Warning}
                                            style={{ width: scale(20), height: verticalScale(22), marginHorizontal: scale(5) }}
                                        />
                                        <Text style={{
                                            fontSize: scale(12),
                                            textTransform: 'capitalize',
                                            letterSpacing: scale(1)
                                        }}>delete account</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        </View>
                    );
                }}
            </ContextConsumer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        ...StyleSheet.absoluteFillObject, // fill up all the screen
        justifyContent: 'flex-end', // align popup ath the bottom 
        backgroundColor: 'transparent',
        alignItems: 'flex-end',
    },
    backDrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.transparentBlack,
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalContainer: {
        height: modalHeight,
        width: modalWidth,
        backgroundColor: colors.white,
        borderTopLeftRadius: 5,
        //borderBottomLeftRadius: 5
    },
})