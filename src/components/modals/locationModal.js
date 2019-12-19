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
import { Cross, InitialBackground } from '../../stats/imports';

const { height } = Dimensions.get('window');
const modalHeight = height / 2;
const modalWidth = scale(350);
const modalHeaderHeight = verticalScale(30);
const modalHeaderImageWidth = modalWidth / 3


export default class Modal extends Component {

    //modalIsOpen, onClose, modalData
    state = {
        position: new Animated.Value(this.props.modalIsOpen ? 0 : verticalScale(height)),
        visibility: this.props.modalIsOpen,
        modalLoader: false
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
                toValue: height, // bottom of the screen
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

        const { adress: { results }, dateObject: { time }, fixDate } = this.props.modalData;
        console.log(`results :${results} , time : ${time} , fixDate : ${fixDate} `);

        let location = results[0].formatted_address;
        let city = results[1].formatted_address;
        let district = results[2].formatted_address;
        let province = results[3].formatted_address;
        let country = results[4].formatted_address;

        return (
            <View style={styles.container}>
                {/* close popup when backdrop pressed*/}
                <TouchableWithoutFeedback onPress={this.props.onClose}>
                    <Animated.View style={styles.backDrop} />
                </TouchableWithoutFeedback>
                <Animated.View
                    style={[styles.modalContainer, {
                        // Animates position on the screen
                        transform: [{ translateY: this.state.position }, { translateX: 0 }]
                    }]}
                >
                    <View style={{ flex: 1 }}>
                        <View style={{
                            backgroundColor: colors.gold,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            height: modalHeaderHeight
                        }}>
                            <TouchableOpacity onPress={this.props.onClose}>
                                <Image
                                    source={Cross}
                                    style={{ width: scale(30), height: verticalScale(30) }}
                                />
                            </TouchableOpacity>

                            <Text style={{
                                color: colors.black,
                                fontSize: scale(16),
                                textTransform: 'uppercase',
                                letterSpacing: scale(2),
                                fontWeight: 'bold'
                            }}
                            >more info...</Text>

                            <View />
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <ImageBackground
                                source={InitialBackground}
                                style={{
                                    height: modalHeight - modalHeaderHeight,
                                    width: modalHeaderImageWidth,
                                }}
                            >
                                <View style={{
                                    flex: 1,
                                    width: modalHeaderImageWidth,
                                    backgroundColor: colors.transparentBlack,
                                    alignItems: 'center',

                                }}>


                                </View>
                            </ImageBackground>
                            <View style={{
                                flex: 1,
                                //backgroundColor: 'red', 
                                width: modalWidth - modalHeaderImageWidth,
                                justifyContent: 'space-around'

                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end'
                                }}>
                                    <Text style={styles.dateTimeTextContainers}>{fixDate}</Text>
                                    <Text style={styles.dateTimeTextContainers}>{time}</Text>
                                </View>
                                <Text style={styles.textTag}>Location</Text>
                                <View style={styles.detailContainer}>
                                    <Text style={styles.textdetail}>{location}</Text>
                                </View>
                                <Text style={styles.textTag}>City</Text>
                                <View style={styles.detailContainer}>
                                    <Text style={styles.textdetail}>{city}</Text>
                                </View>
                                <Text style={styles.textTag}>District</Text>
                                <View style={styles.detailContainer}>
                                    <Text style={styles.textdetail}>{district}</Text>
                                </View>
                                <Text style={styles.textTag}>Province</Text>
                                <View style={styles.detailContainer}>
                                    <Text style={styles.textdetail}>{province}</Text>
                                </View>
                                <Text style={styles.textTag}>Country</Text>
                                <View style={styles.detailContainer}>
                                    <Text style={styles.textdetail}>{country}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject, // fill up all the screen
        justifyContent: 'flex-end', // align popup ath the bottom 
        backgroundColor: 'transparent',

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
        backgroundColor: colors.darkGray
    },
    dateTimeTextContainers: {
        //borderWidth: scale(1),
        margin: verticalScale(5),
        padding: scale(5),
        borderRadius: 5,
        fontSize: scale(10),
        color: colors.white,
        //borderColor: colors.gold,
        backgroundColor: colors.black
    },
    detailContainer: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginHorizontal: scale(5),
        marginBottom: verticalScale(5),
        padding: scale(5),
        borderRadius: 5,
        borderColor: colors.gold,
        backgroundColor: colors.white,
        shadowColor: colors.white,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5
    },
    textTag: {
        fontSize: scale(10),
        color: colors.placeHolderColor,
        letterSpacing: scale(1),
        marginLeft: scale(2)
    },
    textdetail: {
        fontSize: scale(10),
        color: colors.black,
    }
});
