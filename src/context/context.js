import React, { Component, createContext } from 'react';
import { Alert, AsyncStorage, PermissionsAndroid, BackHandler } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import firebase from './firebase';

// All the data handling parts belongs to here..

const Context = createContext();
export default class ContextProvider extends Component {

    state = {
        isConnected: true,
        granted: false,
        userData: [],
        startTracking: false,
        locationData: [],
        isLoading: false,
        dataSet: [],
        modalIsOpen: false,
        modalData: null,
        menuModalIsOpen: false
    }

    UNSAFE_componentWillMount() {
        this.getUserData();
    }

    componentDidMount() {
        this.requestLocationAccessPermission();
        this.handleNetworkConnectivityChange();
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    handleBackPress = () => {
        Alert.alert(
            'Quit',
            'Quit from the app ?',
            [
                { text: 'No', onPress: () => console.log('Not Exit from app') },
                { text: 'yes', onPress: () => BackHandler.exitApp() },
            ],
            { cancelable: false },
        );
        return true;
    }

    handleNetworkConnectivityChange = () => {
        NetInfo.addEventListener(data => {
            this.setState({
                isConnected: data.isConnected
            }, async () => {
                console.log('isConnected:', this.state.isConnected);
                if (this.state.isConnected) {
                    console.log('Inside If');
                    this.setState({
                        isLoading: true
                    });
                    let locationData = [];
                    await AsyncStorage.getAllKeys(async (err, allKeys) => {
                        await AsyncStorage.multiGet(allKeys, (err, dataSet) => {
                            dataSet.map((result, i, data) => {
                                if (result[i] === 'locationData') {
                                    let key = data[i][0];
                                    let value = data[i][1];
                                    let fullObject = JSON.parse(value);
                                    fullObject.map(async (res, i, data) => {
                                        let object = data[i][1];
                                        locationData.push(object);
                                    });
                                }
                            });
                        });
                        console.log('Retrieving LocationDataArray', locationData);
                        if (locationData.length > 0) {
                            // save data to the firebase..
                            console.log('Location data is available to store in firebase');
                            await locationData.map((data) => {
                                this.getLocationAddressFromGoogle(data.latitude, data.longitude, data.timestamp);
                            });
                        }
                        else {
                            console.log('Location data is NOT available to store in firebase');
                            // setTimeout(() => {
                            this.setState({
                                isLoading: false
                            });
                            // }, 3000);
                        }
                        this.deleteDataFromAsyncStorage('locationData');
                    });
                }
            });
        });
    }

    getUserData = async () => {
        let userExist = await AsyncStorage.getItem('userData');
        if (userExist) {
            console.log('UserExist')
            let dataSet = [];
            await AsyncStorage.getAllKeys((err, keys) => {
                AsyncStorage.multiGet(keys, (err, stores) => {
                    if (keys.length > 0) {
                        stores.map((item, index, store) => {
                            //console.log('map:', JSON.parse(item));
                            let key = store[index][0];
                            if (key === 'userData') {
                                let value = store[index][1];
                                let data = JSON.parse(value);
                                dataSet.push(data);
                            }
                        });
                    }
                    else {
                        console.log('No Keys');
                    }

                    this.setState({
                        userData: dataSet
                    }, () => {
                        this.retrieveDataFromFirebaseStorage();
                    })
                })
            });
        }
        else {
            console.log('User not exist')
            this.setState({
                userData: []
            });
        }
    }

    handleLogin = async (navigation, mobile) => {
        if (this.state.userData.length === 0 || (!this.state.userData[0].loginState)) {
            if (mobile === '') {
                Alert.alert(
                    'Alert!',
                    'Please enter the mobile number...',
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false },
                );
            }
            else if (mobile.length !== 10) {
                Alert.alert(
                    'Alert!',
                    'Invalid mobile number...',
                    [
                        { text: 'OK', onPress: () => console.log('OK Pressed') },
                    ],
                    { cancelable: false },
                );
            }
            else {
                console.log('BrandNew or logged out user');
                //change the userData & login
                let userDataObject = {
                    mobile: mobile,
                    loginState: true
                }
                let multiSetPair = [
                    ['userData', JSON.stringify(userDataObject)]
                ];
                try {
                    await AsyncStorage.multiSet(multiSetPair, err => {
                        console.log(err);
                    });
                    this.getUserData();
                    navigation.navigate('Home');
                } catch (error) {
                    console.log(error);
                }
            }
        }
        else {
            console.log('Existing User');
            navigation.navigate('Home');
        }
    }

    handleLogout = async (navigation) => {
        Alert.alert(
            'Logout',
            'Logout from the app ?',
            [
                { text: 'No', onPress: () => console.log('Not Exit from app') },
                {
                    text: 'yes', onPress: async () => {
                        const { mobile } = this.state.userData[0];
                        let userDataObject = {
                            mobile: mobile,
                            loginState: false,
                        }
                        let multiSetPair = [
                            ['userData', JSON.stringify(userDataObject)]
                        ];
                        try {
                            await AsyncStorage.multiSet(multiSetPair, err => {
                                console.log(err);
                            });
                        } catch (error) {
                            console.log(err);
                        }
                        this.deleteDataFromAsyncStorage('locationData');
                        BackHandler.exitApp();
                    }
                },
            ],
            { cancelable: false },
        );


    }

    handleDeleteAccount = () => {

        Alert.alert(
            'WARNING !!!',
            'All the previous location and account details will be deleted. ',
            [
                { text: 'Cancel', onPress: () => console.log('Not Exit from app') },
                {
                    text: 'Continue', onPress: () => {
                        this.deleteDataFromAsyncStorage('userData');
                        this.deleteDataFromAsyncStorage('locationData');

                        const { mobile } = this.state.userData[0];
                        let database = firebase.database();
                        let ref = database.ref('TrackingData');
                        ref.child(mobile).remove();
                        BackHandler.exitApp();

                    }
                },
            ],
            { cancelable: false },
        );



    }

    requestLocationAccessPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Access Permmission',
                    message: 'I-Tracker app needs to access your location, so you can track your location ',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'Ok'
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Acees Location permission granted');
                this.setState({ granted: true })
            }
            else {
                console.log('Location permission denied');
            }
        } catch (error) {
            console.warn(error);
        }
    }

    getCurrentPossition = async (startTracking, minutes) => {
        //console.log('Input Minuts', minutes);
        if (minutes !== '') {
            let time = (parseFloat(minutes) * 60) * 1000;
            if (this.state.granted) {
                this.setState(() => {
                    return { startTracking: !startTracking }
                }, () => {
                    let id = 1;
                    id = setInterval(() => {
                        if (this.state.startTracking === true) {
                            console.log('Start Tracking')
                            Geolocation.getCurrentPosition((Position) => {
                                //console.log('Position : ', Position);
                                if (this.state.isConnected) {
                                    console.log('position data will be directly save to the firebase');
                                    const { coords: { longitude, latitude }, timestamp } = Position;
                                    this.getLocationAddressFromGoogle(latitude, longitude, timestamp);
                                }
                                else {
                                    console.log('position data will be  save to the local storage');
                                    this.saveDataToAsyncStorage(Position);
                                }

                            }, (err) => {
                                console.log(err.code, err.message);
                            }, {
                                    enableHighAccuracy: true,
                                    timeout: 15000,
                                    maximumAge: 10000,
                                }
                            );
                        }
                        else {
                            console.log('Stop Tracking');
                            clearInterval(id);
                        }
                    }, time)
                })

            }
            else {
                this.requestLocationAccessPermission();
            }
        }
        else {
            Alert.alert(
                'Alert!',
                'Please enter a time as the minutes...',
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false },
            );
        }
    }


    saveDataToAsyncStorage = async (locationData) => {
        console.log('saveDataToAsyncStorage');
        //const {username,mobile} = this.state.userData[0];
        const { coords: { longitude, latitude }, timestamp } = locationData;

        let object = {
            latitude: latitude,
            longitude: longitude,
            timestamp: timestamp
        }

        let multipairObject = [
            [timestamp, object]
        ]

        let mainMultipariObject = [
            ['locationData', JSON.stringify(multipairObject)]
        ]

        try {
            await AsyncStorage.getAllKeys(async (err, allKeys) => {
                if (allKeys.length > 0) {
                    await allKeys.map(async (key) => {
                        if (key === 'locationData') {
                            console.log('LocationDataKey Found');
                            let existingData = await AsyncStorage.getItem('locationData');
                            console.log('exist', existingData);
                            let pasedExistingData = JSON.parse(existingData);
                            console.log('PasedExistindData:', pasedExistingData);
                            pasedExistingData.push([timestamp, object]);
                            console.log('AfterPushing:', pasedExistingData);

                            let mainObj = [
                                ['locationData', JSON.stringify(pasedExistingData)]
                            ]
                            await AsyncStorage.multiSet(mainObj, err => {
                                console.log(err);

                            })
                        }
                        else {
                            console.log('UD')
                            await AsyncStorage.multiSet(mainMultipariObject, err => {
                                console.log(err);
                            })
                        }
                    })
                }
                else {
                    console.log('Key length is 0');
                    await AsyncStorage.multiSet(mainMultipariObject, err => {
                        console.log(err);
                    })
                }
            })
        } catch (error) {
            console.log(error);
        }

    }

    deleteDataFromAsyncStorage = async (deletionKey) => {
        console.log(`${deletionKey} is deleted`);
        let key = [deletionKey];
        try {
            await AsyncStorage.multiRemove(key, (err) => {
                console.log(err);
            });
        } catch (error) {
            console.log(error);
        }
    }


    saveDataToFirebaseStorage = async (dataSet) => {
        console.log('saveDataToFirebaseStorage');
        //console.log('dataTobeUpload:', dataSet);
        const userData = this.state.userData[0];
        const { mobile } = userData;
        const { adress, longitude, latitude, timestamp } = dataSet;
        const { dateObject, dateObject: { day, month, date, year, time } } = this.getDate(timestamp);
        const fixDate = date + month + year;
        let database = firebase.database();
        let ref = database.ref('TrackingData/' + mobile + '/' + fixDate);
        ref.push({
            fixDate,
            longitude,
            latitude,
            adress,
            timestamp,
            dateObject
        }).then(() => {
            console.log('Data Uploaded to Firebase')
        }).catch(err => {
            console.log(err);
        });
    }

    getDate(timestamp) {
        var timestamp = new Date(timestamp);
        var str = timestamp.toString();
        var x = str.split(" ");
        var day = x[0];
        var month = x[1];
        var date = x[2];
        var year = x[3];
        var time = x[4];
        var obj = { dateObject: { day, month, date, year, time } }
        return obj;
    }

    retrieveDataFromFirebaseStorage = () => {

        if (this.state.userData.length > 0) {
            let mobile = this.state.userData[0].mobile;
            let database = firebase.database();
            let ref = database.ref('TrackingData/' + mobile);
            ref.on('value', snapShot => {
                console.log('XXXXXXXXXXXXXXXXX RetrieveDataFromFirebaseStorage');
                if (snapShot.val() !== null) {
                    let dataObject = Object.values(snapShot.val());
                    //console.log('dataSetOpbject:', dataObject);
                    let dataSet = [{ dataSetObject: dataObject }];
                    this.setState({
                        dataSet: dataSet,
                        isLoading: false
                    });
                }
                else {
                    console.log('SnapShot is null');
                    this.setState({
                        dataSet: [],
                        isLoading: false
                    });
                }
            });
        }
    }

    getLocationAddressFromGoogle = (latitude, longitude, timestamp) => {
        console.log('getLocationAddressFromGoogle');
        console.log(`lati : ${latitude}, longi: ${longitude}`);

        Geocoder.init("AIzaSyCDEMJDuIHGWEHKksV5tbFco8awAYokgc4");
        Geocoder.from(latitude, longitude)
            .then(data => {
                //var addressComponent = data.results[0].address_components[0];
                console.log(data);
                let dataSet = { adress: data, longitude, latitude, timestamp };
                this.saveDataToFirebaseStorage(dataSet);
            }).catch(error =>
                console.warn(error));
    }

    deleteDataFromFirebase = (key) => {
        Alert.alert(
            'Alert!',
            `Do you want to delete tracking datails in ${key} ?`,
            [
                { text: 'NO', onPress: () => console.log('Cancel') },
                {
                    text: 'YES', onPress: () => {
                        let mobile = this.state.userData[0].mobile;
                        let database = firebase.database();
                        let ref = database.ref('TrackingData/' + mobile);
                        ref.child(key).remove();
                    }
                }
            ],
            { cancelable: false },
        );
    }

    /************************************ MODAL ***************************** */

    openModal = (modalData) => {
        this.setState({
            modalIsOpen: true,
            modalData
        });
    }

    closeModal = () => {
        this.setState({
            modalIsOpen: false
        });
    }


    openMenuModal = () => {
        this.setState({
            menuModalIsOpen: true
        });
    }

    closeMenuModal = () => {
        this.setState({
            menuModalIsOpen: false
        });
    }

    /************************************ END MODAL ***************************** */

    render() {
        return (
            <Context.Provider value={{
                ...this.state,
                handleLogin: this.handleLogin,
                getCurrentPossition: this.getCurrentPossition,
                retrieveDataFromFirebaseStorage: this.retrieveDataFromFirebaseStorage,
                deleteDataFromFirebase: this.deleteDataFromFirebase,
                openModal: this.openModal,
                closeModal: this.closeModal,
                openMenuModal: this.openMenuModal,
                closeMenuModal: this.closeMenuModal,
                handleLogout: this.handleLogout,
                handleDeleteAccount: this.handleDeleteAccount
            }} >
                {
                    this.props.children
                }
            </Context.Provider >
        )
    }
}

const ContextConsumer = Context.Consumer;
export { ContextProvider, ContextConsumer };