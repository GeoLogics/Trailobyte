import React from "react";
import PropTypes from 'prop-types';
import { StyleSheet, Image, Animated, View, Easing } from 'react-native';
import { Actions } from 'react-native-router-flux';

import logoImg from '../../images/logo.png';

export default class SplashScreen extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            fadeVal: new Animated.Value(0),
        };
        
        this.fadeIn = this.fadeIn.bind(this);
        this.fadeOut = this.fadeOut.bind(this);
    }
    
    fadeIn() {
        Animated.timing(this.state.fadeVal, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
    };

    fadeOut() {
        Animated.timing(this.state.fadeVal, {
            toValue: 0,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
    };
    
    componentDidMount() {
        setTimeout(() => {
            this.fadeOut();
        }, 2000);
        setTimeout(() => {
            Actions.loginScreen();
        }, 4000);
    }
    
    render() {
        return (
            <View style={styles.container}>
                <Animated.Image
                    onLoad={this.fadeIn()}
                    source={logoImg} 
                    style={[
                        {
                            width: 150,
                            height: 200,
                            opacity: this.state.fadeVal
                        }
                    ]}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});