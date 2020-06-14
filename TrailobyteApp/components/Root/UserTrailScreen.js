import React from "react";
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, Easing, Dimensions, PermissionsAndroid } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import MapView, { Marker, Polyline } from 'react-native-maps';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';

import Wallpaper from './Wallpaper';
import UserMenu from './UserMenu';

import {targetUri as appEngineUri} from '../../app.json';

const {width, height} = Dimensions.get('window')

const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

export default class UserTrailScreen extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0,
                longitudeDelta: 0,
            },
            markers: [],
            userTrails: [],
            ratingTrails: [],
            userCursor: null,
            ratingCursor: null,
            username: '',
            verifier: ''
        };
        
        this.requestLocationPermission = this.requestLocationPermission.bind(this);
        this.getTrail = this.getTrail.bind(this);
        this.queryTrailByRating = this.queryTrailByRating.bind(this);
        this.queryTrailByUsername = this.queryTrailByUsername.bind(this);
        this.mapMarkers = this.mapMarkers.bind(this);
        
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
                enableHighAccuracy: false, 
                timeout: 15000 
            }
        );
    }
    
    componentDidMount() {
        this.queryTrailByUsername();
        this.queryTrailByRating();
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
                console.log("Location permission granted.");
            } else {
                console.log("Location permission denied.");
            }
        } catch (err) {
            console.warn(err);
        }
    };
    
    async queryTrailByRating() {
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
        
        await fetch(appEngineUri + '/rest/query/byRating', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'username' : this.state.username,
                'Authorization' : 'Bearer ' + this.state.verifier,
            },
            body: JSON.stringify({
                pageSize: 5,
                cursor: this.state.ratingCursor,
            })
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
            this.setState({ratingCursor: data.cursor});
            this.setState({ratingTrails: data.resultList});
        })
        .catch((error) => { alert(error); })
        .done();
    }
    
    async queryTrailByUsername() {
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
        
        await fetch(appEngineUri + '/rest/query/byUser', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'username' : this.state.username,
                'Authorization' : 'Bearer ' + this.state.verifier,
            },
            body: JSON.stringify({
                param: this.state.username,
                pageSize: 5,
                cursor: this.state.userCursor,
            })
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
            this.setState({userCursor: data.cursor});
            this.setState({userTrails: data.resultList});
        })
        .catch((error) => { alert(error); })
        .done();
    }
    
    async getTrail(trailName) {
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
        
        await fetch(appEngineUri + '/rest/trail/OPT3OP/' + trailName, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'username' : this.state.username,
                'Authorization' : 'Bearer ' + this.state.verifier,
            }
        })
        .then(function(response) {
                console.log(response);
                if (response.ok) {
                    return response.json();
                } else if (response.status == 404) {
                    console.log("Percurso não encontrado!");
                } else {
                    throw new Error(response.status);
                }
            })
        .then(data => {
            console.log(data);
            this.setState({markers: data.markers});
        })
        .catch((error) => { alert(error); })
        .done();
    }
    
    mapMarkers() {
        return this.state.markers.map((marker, index) => <Marker
            key={index}
            coordinate={{ latitude: marker.coords.lat, longitude: marker.coords.lng }}
            title={marker.name}
            description={marker.content}
            >
            </Marker >);
    }
    
    mapUserTrails() {
        if (this.state.userTrails && this.state.userTrails.length) {
            return this.state.userTrails.map((trail, index) => <TouchableOpacity
                key={index}
                style={styles.button}
                onPress={() => this.getTrail(trail.name)}>
                    <Text style={styles.text}>{trail.name}</Text>
                </TouchableOpacity >);
        }
    }
    
    mapRatingTrails() {
        if (this.state.ratingTrails && this.state.ratingTrails.length) {
            return this.state.ratingTrails.map((trail, index) => <TouchableOpacity
                key={index}
                style={styles.button}
                onPress={() => this.getTrail(trail.name)}>
                    <Text style={styles.text}>{trail.name}</Text>
                </TouchableOpacity >);
        }
    }
    
    render() {
        return (
            <Wallpaper>
                <View style={styles.container}>
                    <MapView
                        style={styles.map}
                        region={this.state.region}
                        onRegionChangeComplete={region => {
                            this.setState({region});
                        }}
                        showsUserLocation={true}
                        showsCompass={true}
                        zoomEnabled={true}
                        rotateEnabled={true}>
                            {this.mapMarkers()}
                            <Polyline
                                coordinates = {this.state.markers.map((marker) => ({
                                                latitude : marker.coords.lat,
                                                longitude : marker.coords.lng
                                                }))
                                              }
                                strokeColor = '#19B5FE'
                                strokeWidth = {5}
                            />
                    </MapView>                    
                    <View style={styles.trailList}>
                        <View style={styles.userTrailList}>
                            <Text
                                style={styles.title}>
                                    Os meus percursos
                            </Text>
                            {this.mapUserTrails()}
                        </View>
                        <View style={styles.userRatingList}>
                            <Text
                                style={styles.title}>
                                    Top 5
                            </Text>
                            {this.mapRatingTrails()}
                        </View>
                    </View>
                </View>
                <UserMenu />
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
        height: SCREEN_HEIGHT - 400,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    trailList: {
        flex: 1,
        top: SCREEN_HEIGHT - 400,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    userTrailList: {
        marginTop: 40,
        padding: 10,
        borderWidth: 1,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(55, 146, 203, 0.5)',
    },
    userRatingList: {
        marginTop: 40,
        padding: 10,
        borderWidth: 1,
        marginRight: 0,
        borderRadius: 20,
        backgroundColor: 'rgba(55, 146, 203, 0.5)',
    },
    title: {
        alignSelf:'center',
        fontSize: 18,
        fontWeight: '900',
        color: 'white',
        textDecorationLine: 'underline',
    },
    button: {
        color: 'white',
    },
    text: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
    },
});
