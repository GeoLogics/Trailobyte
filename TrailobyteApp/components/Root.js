import React from 'react';
import { Router, Scene } from 'react-native-router-flux';

import SplashScreen from './Root/SplashScreen';
import LoginScreen from './Root/LoginScreen';
import RegisterScreen from './Root/RegisterScreen';
import UserTrailScreen from './Root/UserTrailScreen';

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
                    <Scene key="userTrailScreen"
                        component={UserTrailScreen}
                        animation='fade'
                        hideNavBar={true}
                    />
                </Scene>
            </Router>
        );
	}
}