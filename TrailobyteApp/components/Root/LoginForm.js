import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, KeyboardAvoidingView, View, ActivityIndicator, TouchableOpacity, Image, Dimensions } from 'react-native';

import UserInput from './UserInput';

import usernameImg from '../../images/username.png';
import passwordImg from '../../images/password.png';
import eyeImg from '../../images/eye_black.png';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            showPass: true,
            press: false,
            username: '',
            password: ''
        };
        
        this.showPass = this.showPass.bind(this);
    }
    
    showPass() {
        this.state.press === false
            ? this.setState({showPass: false, press: true})
            : this.setState({showPass: true, press: false});
    }
    
    render() {
        return (
            <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.container}>
                <UserInput
                    source={usernameImg}
                    placeholder="Username"
                    autoCapitalize={'none'}
                    returnKeyType={'done'}
                    autoCorrect={false}
                    onChangeText={(text) => this.setState({username: text})}
                />
                <UserInput
                    source={passwordImg}
                    secureTextEntry={this.state.showPass}
                    placeholder="Password"
                    returnKeyType={'done'}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onChangeText={(text) => this.setState({password: text})}
                />
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.btnEye}
                    onPress={this.showPass}>
                    <Image source={eyeImg} style={styles.iconEye} />
                </TouchableOpacity>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0.6,
        top: 100,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    btnEye: {
        flex: 0,
        top: -30,
        left: 150,
        
    },
    iconEye: {
        width: 25,
        height: 25,
        tintColor: 'rgba(0,0,0,0.4)',
    },
});
