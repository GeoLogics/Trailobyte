import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';

import Logo from './Logo';
import RegisterForm from './RegisterForm';
import Wallpaper from './Wallpaper';
import RegisterButton from './RegisterButton';

import {targetUri as appEngineUri} from '../../app.json';

export default class RegisterScreen extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            userIsRegistered: false,
        };
        
        this._onPress = this._onPress.bind(this);
        this.doRegister = this.doRegister.bind(this);
        this.isRegistered = this.isRegistered.bind(this);
        this.register = this.register.bind(this);
    }
    
    _onPress() {
        Actions.loginScreen();
    }
    
    doRegister() {
        if ((this.refRegisterForm.state.username == '')
            || (this.refRegisterForm.state.email == '')
            || (this.refRegisterForm.state.password == '')
            || (this.refRegisterForm.state.confirmation == '')
            || (this.refRegisterForm.state.telephone == '')
            || (this.refRegisterForm.state.mobilePhone == '')
            || (this.refRegisterForm.state.address == '')) {
            alert('Preencha todos os campos!');
        } else {
            this.register(this.refRegisterForm.state.username,
                            this.refRegisterForm.state.email,
                            this.refRegisterForm.state.password,
                            this.refRegisterForm.state.confirmation,
                            this.refRegisterForm.state.telephone,
                            this.refRegisterForm.state.mobilePhone,
                            this.refRegisterForm.state.address);
        }
    }
    
    isRegistered() {
        return this.state.userIsRegistered;
    }
    
    async register(username, email, password, confirmation, telephone, mobilePhone, address) {
        this.setState({userIsRegistered: false});
        await fetch(appEngineUri + '/rest/register/v1', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials' : 'true'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                confirmation: confirmation,
                telephone: telephone,
                mobilePhone: mobilePhone,
                address: address,
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
        .then(() => {
            this.setState({userIsRegistered: true});
        })
        .catch((error) => { alert(error); })
        .done();
    }
    
    render() {
        return (
            <Wallpaper>
                <Logo />
                <RegisterForm ref = {refRegisterForm => {this.refRegisterForm = refRegisterForm}} />
                <RegisterButton
                    doRegister = {this.doRegister}
                    isRegistered = {this.isRegistered} />
                <View style={styles.container}>
                    <Text
                        style={styles.text}
                        onPress={this._onPress}>
                        Já tem uma conta? Faça login.
                    </Text>
                </View>
            </Wallpaper>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        top: 30,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    text: {
        color: 'white',
        backgroundColor: 'transparent',
    },
});