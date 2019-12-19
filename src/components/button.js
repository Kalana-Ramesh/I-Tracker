import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image
} from 'react-native';
import { scale, verticalScale, colors } from '../stats/styles';
import { BubblesLoader } from 'react-native-indicator';


export default function Btn({ condition, textColor, image, title, onPress, params: { p1, p2 } }) {
    return (
        <TouchableOpacity
            onPress={() => onPress(p1, p2)}
            style={{ alignItems: 'center' }}>
            <View style={{
                backgroundColor: colors.white,
                width: scale(80),
                height: verticalScale(80),
                borderRadius: 100,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                margin: scale(5),
                //borderWidth: scale(2),
                //borderColor: colors.gold,
                shadowColor: colors.black,
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 5,
                elevation: 5

            }}>
                {
                    (condition) ?
                        <BubblesLoader
                            color={colors.gold}
                        />
                        : <Image
                            source={image}
                            style={{
                                width: scale(45),
                                height: verticalScale(45),
                            }}
                        />
                }
            </View>
        </TouchableOpacity>
    )
}