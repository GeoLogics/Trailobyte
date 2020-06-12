import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';

import Logo from './Logo';
import LoginForm from './LoginForm';
import Wallpaper from './Wallpaper';
import LoginButton from './LoginButton';

import {targetUri as appEngineUri} from '../../app.json';

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            userIsLoggedIn: false,
        };
    
        this._onPress = this._onPress.bind(this);
        this.doLogin = this.doLogin.bind(this);
        this.isLoggedIn = this.isLoggedIn.bind(this);
        this.login = this.login.bind(this);
    }
    
    _onPress() {
        Actions.registerScreen();
    }
    
    doLogin() {
        if (this.refLoginForm.state.username == '') {
            alert('Username inválido!');
        } else if (this.refLoginForm.state.password == '') {
            alert('Password inválida!');
        } else {
            this.login(this.refLoginForm.state.username, this.refLoginForm.state.password);
        }
    }
    
    isLoggedIn() {
        return this.state.userIsLoggedIn;
    }
    
    async login(username, password) {
        this.setState({userIsLoggedIn: false});
        await fetch(appEngineUri + '/rest/login/v1', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(function(response) {
                console.log(response);
                if (response.ok) {
                    return response.json();
                } else if (response.status == 403) {
                    throw new Error("Login inválido!");
                } else {
                    throw new Error(response.status);
                }
            })
        .then(async function(data) {
            console.log(data);
            const verifier = data;
            try {
                // Remove items first if they exist
                await AsyncStorage.removeItem('username');
                await AsyncStorage.removeItem('verifier');
                
                // Store the username in AsyncStorage
                if (username != null) {
                    await AsyncStorage.setItem('username', username);
                }
                
                // Store the verifier in AsyncStorage
                if (verifier != null) {
                    await AsyncStorage.setItem('verifier', verifier);
                }
            } catch (error) {
                // Failed to save data in AsyncStorage
            }
        })
        .then(() => {
            this.setState({userIsLoggedIn: true});
        })
        .catch((error) => { alert(error); })
        .done();
    }
    
    render() {
        return (
            <Wallpaper>
                <Logo />
                <LoginForm ref = {refLoginForm => {this.refLoginForm = refLoginForm}} />
                <LoginButton
                    doLogin = {this.doLogin}
                    isLoggedIn = {this.isLoggedIn} />
                <View style={styles.container}>
                    <Text
                        style={styles.text}
                        onPress={this._onPress}>
                        Registar
                    </Text>
                    <Text
                        style={styles.text}>
                        Recuperar password
                    </Text>
                </View>
            </Wallpaper>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        top: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    text: {
        color: 'white',
        backgroundColor: 'transparent',
    },
});