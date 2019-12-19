import React from 'react';
import {
    View,
    StatusBar,
    ScrollView,
    StyleSheet,
    FlatList,
    Text,
    Image,

} from 'react-native';
import Header from '../components/header';
//import Activity from '../components/activity';
import Activity from '../components/activity';
import { ContextConsumer } from '../context/context';
import { colors, scale } from '../stats/styles';
import Title from '../components/title';
import Connection from '../components/connection';
import Tile from '../components/tile';
import { BubblesLoader, TextLoader } from 'react-native-indicator';
import EmptyData from '../components/emptyData';
import Date from '../components/date';
import LocationModal from '../components/modals/locationModal';
import { Trash } from '../stats/imports';

export default function home({ navigation }) {
    return (
        <ContextConsumer>
            {(context) => {

                const {
                    isConnected,
                    isLoading,
                    dataSet,
                    retrieveDataFromFirebaseStorage,
                    deleteDataFromFirebase,
                    openModal,
                    modalIsOpen,

                    closeModal,
                    modalData
                } = context;

                let dataSetObject;
                if (dataSet.length > 0) {
                    dataSetObject = dataSet[0].dataSetObject;
                }

                return (

                    <View style={{ flex: 1 }}>
                        <StatusBar backgroundColor={'black'} />
                        <Header navigation={navigation} />
                        <View style={styles.container}>
                            <ScrollView>
                                <Title title="location tracker" />
                                <Activity />
                                <Title title="previous location details" />
                                {
                                    (!isConnected) &&
                                    <Connection />
                                }
                                {
                                    (isLoading) ?
                                        <View style={{
                                            alignItems: 'center',
                                            margin: scale(10),

                                        }}>
                                            <BubblesLoader color="#977428" />
                                            <TextLoader text="Loading" textStyle={{ letterSpacing: scale(1) }} />
                                        </View>
                                        : dataSet.length > 0 ?
                                            <FlatList
                                                data={dataSetObject}
                                                renderItem={({ item, index }) =>
                                                    <View>
                                                        <View style={{
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between'
                                                        }}>
                                                            <Date
                                                                deleteFunc={deleteDataFromFirebase}
                                                                date={Object.values(item).map((data, index) => {
                                                                    if (index === 0) return data.fixDate
                                                                })} />

                                                        </View>
                                                        <FlatList
                                                            showsHorizontalScrollIndicator={false}
                                                            key={index}
                                                            data={Object.values(item)}
                                                            horizontal={true}
                                                            renderItem={({ item, index }) =>
                                                                <Tile
                                                                    key={index}
                                                                    dataSet={item}
                                                                    index={index}
                                                                    openModal={openModal}
                                                                />}
                                                        />
                                                    </View>
                                                }
                                            />
                                            : <EmptyData refresh={retrieveDataFromFirebaseStorage} />
                                }
                            </ScrollView>
                        </View>
                        <LocationModal
                            modalIsOpen={modalIsOpen}
                            onClose={closeModal}
                            modalData={modalData}
                        />
                    </View>
                )
            }}
        </ContextConsumer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    }
})
