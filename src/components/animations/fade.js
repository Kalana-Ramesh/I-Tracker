import React, { useState, useEffect } from 'react';
import { Animated, Text, View } from 'react-native';

export default function FadeInView(props) {
    const { initial, toValue, duration } = props;
    const [fadeAnim] = useState(new Animated.Value(initial))  // Initial value for opacity: 0

    React.useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: toValue,
                duration: duration,
            }
        ).start();
    }, [])

    return (
        <Animated.View                 // Special animatable View
            style={{
                ...props.style,
                opacity: fadeAnim,         // Bind opacity to animated value
            }}
        >
            {props.children}
        </Animated.View>
    );
}