import React from 'react';
import { Router, Scene } from 'react-native-router-flux';

import SplashScreen from './Root/SplashScreen';
import LoginScreen from './Root/LoginScreen';
import RegisterScreen from './Root/RegisterScreen';
import UserScreen from './Root/UserScreen';

export default class Main extends React.Component {
    render() {
        return (
            <Router>
                <Scene key="root">
                    <Scene key="splashScreen"
                        component={SplashScreen}
                        animation='fade'
                        hideNavBar={true}
                        initial={true}
                    />
                    <Scene key="loginScreen"
                        component={LoginScreen}
                        animation='fade'
                        hideNavBar={true}
                    />
                    <Scene key="registerScreen"
                        component={RegisterScreen}
                        animation='fade'
                        hideNavBar={true}
                    />
                    <Scene key="userScreen"
                        component={UserScreen}
                        animation='fade'
                        hideNavBar={true}
                    />
                </Scene>
            </Router>
        );
	}
}