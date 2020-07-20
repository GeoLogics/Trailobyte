import React from "react";
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, Text, TouchableOpacity, Animated, Easing, Dimensions, PermissionsAndroid } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';

import logoutImg from '../../images/menu_logout.png';
import userImg from '../../images/menu_user.png';
import trailImg from '../../images/menu_trail.png';
import quizzImg from '../../images/menu_quizz.png';

import {targetUri as appEngineUri} from '../../app.json';

const ITEM_SIZE = 40

export default class UserMenu extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            isLoading: false,
            username: '',
            verifier: ''
        };
        
        this.growAnimated = new Animated.Value(0);
        this._onPressLogout = this._onPressLogout.bind(this);
        this._onPressUserTrailList = this._onPressUserTrailList.bind(this);
        this._onPressUserQuizz = this._onPressUserQuizz.bind(this);
        this._onPressUserArea = this._onPressUserArea.bind(this);
        this.logout = this.logout.bind(this);
    }
    
    _onPressLogout() {
        if (this.state.isLoading) return;

        this.setState({isLoading: true});
        this.logout();

        Animated.timing(this.growAnimated, {
            toValue: 1,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();

        setTimeout(() => {
            Actions.loginScreen();
        }, 500);
    }
    
    _onPressUserTrailList() {
        Actions.userTrailListScreen();
    }
    
    _onPressUserQuizz() {
        Actions.userQuizzScreen();
    }
    
    _onPressUserArea() {
        Actions.userAreaScreen();
    }
    
    async logout() {
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
        
        await fetch(appEngineUri + '/rest/logout/v1', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'username' : this.state.username,
                'Authorization' : 'Bearer ' + this.state.verifier,
            }
        })
        .then(function(response) {
                console.log(response);
                if (!response.ok) {
                    throw new Error(response.status);
                }
            })
        .then(async () => {
            try {
                // Remove items first if they exist
                await AsyncStorage.removeItem('username');
                await AsyncStorage.removeItem('verifier');
            } catch (error) {
                // Failed to save data in AsyncStorage
            }
        })
        .catch((error) => { console.log(error); })
        .done();
    }
    
    render() {
        const changeScale = this.growAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [1, ITEM_SIZE],
        });
        return (
            <View style={styles.container}>
                <View style={styles.navbar}>
                    <TouchableOpacity
                        onPress={this._onPressUserTrailList}
                        style={styles.button}>
                            <Image style={styles.image} source={trailImg} />
                            <Text style={styles.text}>Percursos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this._onPressUserQuizz}
                        style={styles.button}>
                            <Image style={styles.image} source={quizzImg} />
                            <Text style={styles.text}>Quizzes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this._onPressUserArea}
                        style={styles.button}>
                            <Image style={styles.image} source={userImg} />
                            <Text style={styles.text}>Utilizador</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this._onPressLogout}
                        style={styles.button}>
                            <Image style={styles.image} source={logoutImg} />
                            <Text style={styles.text}>Sair</Text>
                    </TouchableOpacity>
                    <Animated.View style={[styles.circle, {transform: [{scale: changeScale}]}]} />
                </View>
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
    navbar: {
        width: '100%',
        height: 80,
        backgroundColor: '#3792CB',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    },
    button: {
        alignItems: 'center',
        left: 15,
        marginLeft: 20,
        marginRight: 30,
    },
    circle: {
        height: ITEM_SIZE,
        width: ITEM_SIZE,
        marginTop: -ITEM_SIZE,
        borderRadius: 100,
        backgroundColor: '#3792CB',
    },
    image: {
        width: 30,
        height: 30,
    },
    text: {
        marginTop: 10,
        color: 'white',
        backgroundColor: 'transparent',
    },
});
