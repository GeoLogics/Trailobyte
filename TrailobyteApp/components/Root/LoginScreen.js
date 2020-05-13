import React from "react";
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';

import Logo from './Logo';
import UserForm from './UserForm';
import Wallpaper from './Wallpaper';
import LoginButton from './LoginButton';
import SignupSection from './SignupSection';

import {targetUri as appEngineUri} from '../../app.json';

export default class LoginScreen extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            userIsLoggedIn: false,
        };
    
        this.doLogin = this.doLogin.bind(this);
        this.isLoggedIn = this.isLoggedIn.bind(this);
    }
    
    doLogin() {
        if (this.refUserForm.state.username == '') {
            alert('Error: Username inválido!');
        } else if (this.refUserForm.state.password == '') {
            alert('Error: Password inválida!');
        } else {
            this.login(this.refUserForm.state.username, this.refUserForm.state.password);
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
                <UserForm ref = {refUserForm => {this.refUserForm = refUserForm;}} />
                <LoginButton
                    doLogin = {this.doLogin}
                    isLoggedIn = {this.isLoggedIn} />
                <SignupSection />
            </Wallpaper>
        );
    }
}
