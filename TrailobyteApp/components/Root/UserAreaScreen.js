import React from "react";
import PropTypes from 'prop-types';
import { StyleSheet, KeyboardAvoidingView, View, Image, Text, TouchableOpacity, Animated, Easing, Dimensions, PermissionsAndroid } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import MapView, { Marker, Polyline } from 'react-native-maps';
import AsyncStorage from '@react-native-community/async-storage';

import Wallpaper from './Wallpaper';
import UserAreaEditForm from './UserAreaEditForm';
import UserAreaEditButton from './UserAreaEditButton';
import UserMenu from './UserMenu';

import userImg from '../../images/menu_user.png';

import {targetUri as appEngineUri} from '../../app.json';

export default class UserAreaScreen extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            username: '',
            verifier: '',
            email: '',
            telephone: '',
            mobilePhone: '',
            address: '',
        };
        
        this.list = this.list.bind(this);
        this.update = this.update.bind(this);
        this.doUpdate = this.doUpdate.bind(this);
    }
    
    componentDidMount() {
        this.list();
    }
    
    doUpdate() {
        if ((this.refUpdateForm.state.password == '')
            || (this.refUpdateForm.state.confirmation == '')) {
            alert('Introduza e confirme a sua password!');
        } else {
            var userEmail = this.state.email;
            var userTelephone = this.state.telephone;
            var userMobilePhone = this.state.mobilePhone;
            var userAddress = this.state.address;
            
            if (this.refUpdateForm.state.email != '')
                userEmail = this.refUpdateForm.state.email;
            if (this.refUpdateForm.state.telephone != '')
                userTelephone = this.refUpdateForm.state.telephone;
            if (this.refUpdateForm.state.mobilePhone != '')
                userMobilePhone = this.refUpdateForm.state.mobilePhone;
            if (this.refUpdateForm.state.address != '')
                userAddress = this.refUpdateForm.state.address;
            
            this.update(userEmail,
                        this.refUpdateForm.state.password,
                        this.refUpdateForm.state.confirmation,
                        userTelephone,
                        userMobilePhone,
                        userAddress);
        }
    }
    
    async list() {
        try {
            // Get items from AsyncStorage
            const usernameValue = await AsyncStorage.getItem('username');
            const verifierValue = await AsyncStorage.getItem('verifier');
            
            // Set current username
            if (usernameValue !== null) {
                console.log(usernameValue);
                this.setState({username: usernameValue});
            }
            
            // Set current verifier
            if (verifierValue !== null) {
                console.log(verifierValue);
                this.setState({verifier: verifierValue});
            }
        } catch (error) {
            // Failed to load data from AsyncStorage
        }
        
        await fetch(appEngineUri + '/rest/list/v1', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'username' : this.state.username,
                'Authorization' : 'Bearer ' + this.state.verifier,
            },
        })
        .then(function(response) {
                console.log(response);
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(response.status);
                }
            })
        .then(data => {
            console.log(data);
            this.setState({email: data.email});
            this.setState({telephone: data.telephone});
            this.setState({mobilePhone: data.mobilePhone});
            this.setState({address: data.address});
        })
        .catch((error) => { alert(error); })
        .done();
    }    
    
    async update(email, password, confirmation, telephone, mobilePhone, address) {
        try {
            // Get items from AsyncStorage
            const usernameValue = await AsyncStorage.getItem('username');
            const verifierValue = await AsyncStorage.getItem('verifier');
            
            // Set current username
            if (usernameValue !== null) {
                console.log(usernameValue);
                this.setState({username: usernameValue});
            }
            
            // Set current verifier
            if (verifierValue !== null) {
                console.log(verifierValue);
                this.setState({verifier: verifierValue});
            }
        } catch (error) {
            // Failed to load data from AsyncStorage
        }
        
        await fetch(appEngineUri + '/rest/update/v1', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'username' : this.state.username,
                'Authorization' : 'Bearer ' + this.state.verifier,
            },
            body: JSON.stringify({
                username: this.state.username,
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
                    throw new Error("Alteração de perfil inválida!");
                } else {
                    throw new Error(response.status);
                }
            })
        .catch((error) => { alert(error); })
        .done();
    }
    
    render() {
        return (
            <Wallpaper>
                <View style={styles.container}>
                    <Image 
                        style={styles.avatar} 
                        source={userImg}/>
                    <Text
                        style={styles.name}>
                            {this.state.username}
                    </Text>
                    <UserAreaEditForm
                        ref = {refUpdateForm => {this.refUpdateForm = refUpdateForm}}
                        email={this.state.email}
                        telephone={this.state.telephone}
                        mobilePhone={this.state.mobilePhone}
                        address={this.state.address}/>
                    <UserAreaEditButton
                        doUpdate = {this.doUpdate}/>
                </View>
                <UserMenu />
            </Wallpaper>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        top: 10,
        padding: 110,
        justifyContent: 'flex-end',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: 'white',
        alignSelf:'center',
        position: 'absolute',
        top: 40,
    },
    name: {
        fontSize: 22,
        marginTop: 80,
        top: 70,
        color: "#FFFFFF",
        fontWeight: '600',
    },
    text: {
        color: 'white',
        backgroundColor: 'transparent',
    },
});
