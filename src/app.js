import React, { Component } from 'react';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';
import { createAppContainer } from 'react-navigation';
import { Transition } from 'react-native-reanimated';
import Initial from './screens/initial';
import Home from './screens/home';
import ContextProvider from './context/context';


const Switch = createAnimatedSwitchNavigator(
    {
        Initial: Initial,
        Home: Home
    },
    {
        transition: (
            <Transition.Together>
                <Transition.Out
                    type="slide-left"
                    durationMs={600}
                    interpolation="easeIn"
                />
                <Transition.In
                    type="fade"
                    durationMs={500}
                />
            </Transition.Together>
        ),
    }
)

const SwitchContainer = createAppContainer(Switch);

export default class app extends Component {
    render() {
        return (
            <ContextProvider>
                <SwitchContainer />
            </ContextProvider>
        );
    }
}

