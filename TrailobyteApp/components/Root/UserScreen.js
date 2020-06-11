import React from "react";
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, TouchableOpacity, Animated, Easing, Dimensions, PermissionsAndroid } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';

import Wallpaper from './Wallpaper';

import arrowImg from '../../images/left-arrow.png';
import {targetUri as appEngineUri} from '../../app.json';

const {width, height} = Dimensions.get('window')

const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const ITEM_SIZE = 40;

export default class UserScreen extends React.Component {
    constructor() {
        super();
        
        this.state = {
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0,
            },
            isLoading: false,
            username: '',
            verifier: ''
        };

        this._onPress = this._onPress.bind(this);
        this.growAnimated = new Animated.Value(0);
        
        if (Platform.OS === "android") {
            this.requestLocationPermission();
        }
        
        Geolocation.getCurrentPosition(
            (position) => {
                var lat = parseFloat(position.coords.latitude);
                var long = parseFloat(position.coords.longitude);
                
                var currentRegion = {
                    latitude: lat,
                    longitude: long,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }

                this.setState({region: currentRegion});
            },
            (error) => {
                console.log(error.code, error.message);
                throw error;
            },
            {
                showLocationDialog: true,
                forceRequestLocation: true, 
                enableHighAccuracy: true, 
                timeout: 15000 
            }
        );
    }
    
    async requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Access Location Permission",
                    message: "Trailobyte needs access to your location.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                this.setState({hasLocationPermission: true});
            } else {
                this.setState({hasLocationPermission: false});
            }
        } catch (err) {
            console.warn(err);
        }
    };

    _onPress() {
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
            Actions.pop();
        }, 500);
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
        .catch((error) => { alert(error); })
        .done();
    }

    render() {
        const changeScale = this.growAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [1, ITEM_SIZE],
        });
        
        return (
            <Wallpaper>
                <View style={styles.container}>
                    <MapView
                        style={styles.map}
                        region={this.state.region}
                        onRegionChangeComplete={ region => {
                            this.setState({region});
                        }}
                        showsUserLocation={ true } >
                    </MapView>
                    <TouchableOpacity
                        onPress={this._onPress}
                        style={styles.button}
                        activeOpacity={1}>
                            <Image style={styles.image} source={arrowImg} />
                    </TouchableOpacity>
                    <Animated.View style={[styles.circle, {transform: [{scale: changeScale}]}]} />
                </View>
            </Wallpaper>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        borderRadius: 100,
        zIndex: 99,
        backgroundColor: '#555555',
    },
    circle: {
        height: ITEM_SIZE,
        width: ITEM_SIZE,
        marginTop: -ITEM_SIZE,
        borderRadius: 100,
        backgroundColor: '#555555',
    },
    image: {
        width: 24,
        height: 24,
    },
});