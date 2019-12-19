import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale = size => width / guidelineBaseWidth * size;
const verticalScale = size => height / guidelineBaseHeight * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const goldColor = '#977428';
const lightGoldColor = 'rgba(59,45,16,0.5)';

const colors = {
    gold: '#977428',
    transparentGold: 'rgba(59,45,16,0.5)',
    transparentBlack: 'rgba(0,0,0,0.5)',
    transparentWhite: 'rgba(255,255,255,0.5)',
    black: '#000',
    white: '#fff',
    red: '#E74C3C',
    darkBlue: '#161B33',
    darkGray: '#cfcfcf',
    placeHolderColor: 'rgba(0,0,0.0980392,0.3)'
}

export {
    scale,
    verticalScale,
    moderateScale,
    goldColor,
    lightGoldColor,
    colors
};