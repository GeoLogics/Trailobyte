import React from "react";
import PropTypes from 'prop-types';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, Animated, Easing, Dimensions, PermissionsAndroid } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import MapView, { Callout, Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import { Button, RadioButton, Paragraph, Dialog, Portal } from 'react-native-paper';
import { Rating } from 'react-native-ratings';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import { getDistance, isPointWithinRadius } from 'geolib';

import Wallpaper from './Wallpaper';
import UserMenu from './UserMenu';

import {targetUri as appEngineUri} from '../../app.json';

const {width, height} = Dimensions.get('window')

const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const RADIUS = 100

export default class UserTrailScreen extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 1000,
                longitudeDelta: 1000,
            },
            startCoords: {
                latitude: 0,
                longitude: 0,
            },
            isMapReady: false,
            mapType: 'standard',
            trail: [],
            trailName: this.props.trail,
            trailMarkers: [],
            trailReviews: [],
            trailQuizzQuestions: [],
            trailQuizzCurrentQuestion: [],
            trailQuizzCurrentAnswer: null,
            trailQuizzCorrectAnswerCount: 0,
            totalTrailQuizzQuestions: 0,
            answeredTrailQuizzQuestions: 0,
            reviewsCursor: null,
            isStartTrailDialogVisible: false,
            isStartTrailQuizzDialogVisible: false,
            isTrailQuizzQuestionDialogVisible: false,
            isEndTrailDialogVisible: false,
            isFarAwayDialogVisible: false,
            isTrailStatsDialogVisible: false,
            isTrailReviewDialogVisible: false,
            isTrailActive: false,
            isTrailQuizzActive: false,
            isTrailSelectedMarkerDialogVisible: false,
            trailSelectedMarker: [],
            trailReviewRating: 0,
            time: 0,
            distance: 0,
            finalTime: 0,
            finalDistance: 0,
            visitedMarkers: [],
            startMarkerName: '',
            username: '',
            verifier: ''
        };
        
        this.convertTime = this.convertTime.bind(this);
        this.requestLocationPermission = this.requestLocationPermission.bind(this);
        this.trackLocation = this.trackLocation.bind(this);
        this.getTrail = this.getTrail.bind(this);
        this.getTrailQuizz = this.getTrailQuizz.bind(this);
        this.postQuizzResult = this.postQuizzResult.bind(this);
        this.queryTrailReviews = this.queryTrailReviews.bind(this);
        this.renderTrailDetails = this.renderTrailDetails.bind(this);
        this.renderTrailReviews = this.renderTrailReviews.bind(this);
        this.mapMarkers = this.mapMarkers.bind(this);
        this.checkStartTrail = this.checkStartTrail.bind(this);
        this.startTrail = this.startTrail.bind(this);
        this.endTrail = this.endTrail.bind(this);
        this.checkEndTrail = this.checkEndTrail.bind(this);
        this.checkTrailMarker = this.checkTrailMarker.bind(this);
        this.showTrailQuizzQuestion = this.showTrailQuizzQuestion.bind(this);
        this.checkTrailQuizzQuestion = this.checkTrailQuizzQuestion.bind(this);
        this.submitTrailReview = this.submitTrailReview.bind(this);
        this.postReview = this.postReview.bind(this);
        
        if (Platform.OS === "android") {
            this.requestLocationPermission();
        }
    }
    
    componentDidMount() {
        this.trackLocation();
        this.getTrail(this.state.trailName);
        this.queryTrailReviews(this.state.trailName);
        this.getTrailQuizz(this.state.trailName, 0);
        setInterval(() => {
            var currentTime = this.state.time + 1;
            var currentDistance = getDistance(
                { latitude: this.state.startCoords.latitude, longitude: this.state.startCoords.longitude },
                { latitude: this.state.region.latitude, longitude: this.state.region.longitude });
            this.setState({time: currentTime});
            this.setState({distance: currentDistance});
        }, 1000);
    }
    
    convertTime(seconds) {
        var date = new Date(0);
        date.setSeconds(seconds);
        var timeString = date.toISOString().substr(11, 8);
        return timeString;
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
    
    trackLocation() {
        Geolocation.getCurrentPosition(
            (position) => {
                var lat = parseFloat(position.coords.latitude);
                var long = parseFloat(position.coords.longitude);
                
                var initialRegion = {
                    latitude: lat,
                    longitude: long,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }
                this.setState({region: initialRegion});
            },
            (error) => {
                console.log(error.code, error.message);
            },
            {
                enableHighAccuracy: true, 
                timeout: 20000
            }
        );
        
        Geolocation.watchPosition(
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
            }
        );
        
        this.setState({isMapReady: true});
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
            this.setState({trail: data});
            this.setState({trailMarkers: data.markers});
            this.setState({startMarkerName: data.start});
            this.setState({endMarkerName: data.end});
        })
        .catch((error) => { console.log(error); })
        .done();
    }
    
    async getTrailQuizz(trailName, verificationLevel) {
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
        
        await fetch(appEngineUri + '/rest/trail/OPT8OP/' + trailName, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'username' : this.state.username,
                'Authorization' : 'Bearer ' + this.state.verifier,
            },
            body: JSON.stringify({
                param: verificationLevel,
            })
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
            this.setState({trailQuizzQuestions: data});
        })
        .catch((error) => { console.log(error); })
        .done();
    }
    
    async postQuizzResult(trailName, rightCount, wrongCount) {
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
        
        await fetch(appEngineUri + '/rest/trail/OPT9OP/' + trailName, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'username' : this.state.username,
                'Authorization' : 'Bearer ' + this.state.verifier,
            },
            body: JSON.stringify({
                right: rightCount,
                wrong: wrongCount,
                trailName: trailName,
                userName: this.state.username
            })
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
        })
        .catch((error) => { console.log(error); })
        .done();
    }
    
    async queryTrailReviews(trailName) {
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
        
        await fetch(appEngineUri + '/rest/query/trailReviews', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'username' : this.state.username,
                'Authorization' : 'Bearer ' + this.state.verifier,
            },
            body: JSON.stringify({
                param: trailName,
                pageSize: 10,
                cursor: this.state.reviewsCursor,
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
            this.setState({reviewsCursor: data.cursor});
            this.setState({trailReviews: data.resultList});
        })
        .catch((error) => { console.log(error); })
        .done();
    }
    
    async postReview(trailName, trailRating) {
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
        
        await fetch(appEngineUri + '/rest/trail/OPT4OP', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'username' : this.state.username,
                'Authorization' : 'Bearer ' + this.state.verifier,
            },
            body: JSON.stringify({
                author: this.state.username,
                trailName: trailName,
                comment: '',
                rating: trailRating,
            })
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
        })
        .catch((error) => { console.log(error); })
        .done();
    }
    
    renderTrailDetails() {
        return (
            <View>
                <Text style={styles.trailTitleText}>
                    {this.state.trailName}
                </Text>
                <Text style={styles.trailDescriptionText}>
                    {this.state.trail.description}
                </Text>
                <Image source={this.state.trail.trailImg ? {uri: this.state.trail.trailImg} : null} style={styles.trailImage} />
            </View>
        );
    }
    
    renderTrailReviews() {
        if (this.state.trailReviews && this.state.trailReviews.length) {
            return this.state.trailReviews.map((review, index) => <View
                style={{backgroundColor: 'white', margin: 20}}
                key={index}>
                <Text style={styles.trailDescriptionText}>
                    {review.author}
                </Text>
                <Rating style={{position: 'absolute', top: 30, paddingLeft: 8, paddingTop: 10, marginBottom: 20}}
                    type={'star'}
                    imageSize={20}
                    ratingCount={5}
                    startingValue={review.rating}
                    readonly={true}
                />
                <Text style={styles.trailDescriptionText}>
                    {review.comment}
                </Text>
            </View>);
        }
    }

    mapMarkers() {
        return this.state.trailMarkers.map((marker, index) => <Marker
            key={index}
            coordinate={{
                latitude: marker.coords.lat,
                longitude: marker.coords.lng
            }}>
                <Callout 
                    style={styles.trailMarkerCallout}
                    onPress={() => {this.setState({
                        trailSelectedMarker: marker,
                        isTrailSelectedMarkerDialogVisible: true,
                    })}}>
                    <View style={styles.trailMarkerCalloutView}>
                        <Text style={styles.trailMarkerCalloutText}>{marker.name}</Text>
                        <Text style={{top: -40}}>
                            <Image source={marker.imgURL ? {uri: marker.imgURL} : null} style={styles.trailMarkerCalloutImage} />
                        </Text>
                    </View>
                </Callout>
            </Marker >);
    }
    
    checkStartTrail() {
        this.setState({isStartTrailDialogVisible: false});
        if (this.state.trailQuizzQuestions && this.state.trailQuizzQuestions.length) {
            this.setState({isStartTrailQuizzDialogVisible: true});
            this.setState({trailQuizzCorrectAnswerCount: 0});
            this.setState({totalTrailQuizzQuestions: this.state.trailQuizzQuestions.length});
        } else {
            this.startTrail(false);
        }
    }
    
    startTrail(hasQuizz) {
        this.setState({isStartTrailQuizzDialogVisible: false});
        
        var canStart = false;
        var firstMarker = null;
        this.state.trailMarkers.map((marker) => {
                if (marker.name == this.state.startMarkerName) {
                    var isClose = isPointWithinRadius(
                        { latitude: marker.coords.lat, longitude: marker.coords.lng },
                        { latitude: this.state.region.latitude, longitude: this.state.region.longitude },
                        RADIUS);
                    if (isClose) {
                        canStart = true;
                        firstMarker = marker;
                        this.setState({visitedMarkers: [...this.state.visitedMarkers, marker]});
                    }
                }
            }
        );
        
        if (canStart) {
            this.setState({isTrailActive: true});
            this.setState({isTrailQuizzActive: hasQuizz});
            this.setState({startCoords: {
                    latitude: this.state.region.latitude,
                    longitude: this.state.region.longitude
                }
            });
            this.setState({time: 0});
            this.setState({distance: 0});
            if (hasQuizz) {
                this.showTrailQuizzQuestion(firstMarker.name);
            }
        } else {
            this.setState({isFarAwayDialogVisible: true});
            this.setState({isTrailActive: false});
            this.setState({isTrailQuizzActive: false});
        }
    }
    
    endTrail() {
        this.setState({isEndTrailDialogVisible: false});
        if (this.state.isTrailQuizzActive) {
            var rightCount = this.state.trailQuizzCorrectAnswerCount;
            var wrongCount = this.state.totalTrailQuizzQuestions - this.state.trailQuizzCorrectAnswerCount;
            this.postQuizzResult(this.state.trailName, rightCount, wrongCount);
        }
        this.setState({finalTime: this.state.time});
        this.setState({finalDistance: this.state.distance});
        this.setState({isTrailActive: false});
        this.setState({isTrailStatsDialogVisible: true});
    }
    
    checkEndTrail() {
        this.setState({isTrailStatsDialogVisible: false});
        this.setState({isTrailQuizzActive: false});
        this.setState({isTrailReviewDialogVisible: true});
    }
    
    checkTrailMarker(nativeEvent) {
        if (nativeEvent) {
            this.state.trailMarkers.map((marker) => {
                    if ((marker.coords.lat == nativeEvent.coordinate.latitude) &&
                        (marker.coords.lng == nativeEvent.coordinate.longitude)) {
                        var isClose = isPointWithinRadius(
                            { latitude: marker.coords.lat, longitude: marker.coords.lng },
                            { latitude: this.state.region.latitude, longitude: this.state.region.longitude },
                            RADIUS);
                        if (isClose &&
                            this.state.isTrailActive && 
                            this.state.visitedMarkers.every((v) => v.name !== marker.name)) {
                                this.setState({visitedMarkers: [...this.state.visitedMarkers, marker]});
                                if (this.state.isTrailQuizzActive) {
                                    this.showTrailQuizzQuestion(marker.name);
                                }
                        }
                    }
                }
            );
        }
    }
    
    showTrailQuizzQuestion(markerName) {
        this.state.trailQuizzQuestions.map((question) => {
            if (question.markerName == markerName) {
                this.setState({isTrailQuizzQuestionDialogVisible: true});
                this.setState({trailQuizzCurrentQuestion: question});
                this.setState({answeredTrailQuizzQuestions: this.state.answeredTrailQuizzQuestions + 1});
            }
        });
    }
    
    checkTrailQuizzQuestion() {
        this.setState({isTrailQuizzQuestionDialogVisible: false});
        if (this.state.trailQuizzCurrentQuestion.answer == this.state.trailQuizzCurrentAnswer) {
            this.setState({trailQuizzCorrectAnswerCount: this.state.trailQuizzCorrectAnswerCount + 1});
        }
    }
    
    submitTrailReview() {
        this.setState({isTrailReviewDialogVisible: false});
        this.postReview(this.state.trailName, this.state.trailReviewRating);
    }
    
    render() {
        return (
            <Wallpaper>
                <View style={styles.container}>
                    <ScrollView style={styles.trailView}>
                        {this.renderTrailDetails()}
                        <Text style={styles.trailTitleText}>Comentários</Text>
                        {this.renderTrailReviews()}
                    </ScrollView>
                    { this.state.isMapReady &&
                        <MapView
                            style={styles.map}
                            provider={PROVIDER_GOOGLE}
                            mapType={this.state.mapType}
                            initialRegion={this.state.region}
                            showsUserLocation={true}
                            followUserLocation ={true}
                            showsMyLocationButton={true}
                            zoomEnabled={true}
                            onUserLocationChange={(event) => this.checkTrailMarker(event.nativeEvent)}>
                                {this.mapMarkers()}
                                <Polyline
                                    coordinates = {this.state.trailMarkers.map((marker) => ({
                                                    latitude: marker.coords.lat,
                                                    longitude: marker.coords.lng
                                                    }))
                                                  }
                                    strokeColor = {'#19B5FE'}
                                    strokeWidth = {5}
                                />
                        </MapView>
                    }
                    <DropDownPicker
                        items={[
                            {label: 'Standard', value: 'standard'},
                            {label: 'Satélite', value: 'satellite'},
                            {label: 'Híbrido', value: 'hybrid'},
                            {label: 'Terreno', value: 'terrain'},
                        ]}
                        defaultValue={this.state.mapType}
                        containerStyle={{flex: 1, margin: 10, height: 40, width: 150, position: 'absolute'}}
                        style={{backgroundColor: '#fafafa'}}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{backgroundColor: '#fafafa'}}
                        onChangeItem={item => this.setState({
                            mapType: item.value
                        })}
                    />
                    { !this.state.isTrailActive &&
                        <TouchableOpacity
                                    style={styles.startButton}
                                    onPress={() => this.setState({isStartTrailDialogVisible: true})}
                                    activeOpacity={0.4}>
                                        <Text style={styles.buttonText}>INICIAR</Text>
                        </TouchableOpacity>
                    }
                    { this.state.isTrailActive &&
                        <TouchableOpacity
                                    style={styles.endButton}
                                    onPress={() => this.setState({isEndTrailDialogVisible: true})}
                                    activeOpacity={0.4}>
                                        <Text style={styles.buttonText}>TERMINAR</Text>
                        </TouchableOpacity>
                    }
                    <Portal>
                        <Dialog visible={this.state.isTrailSelectedMarkerDialogVisible} onDismiss={() => this.setState({isTrailSelectedMarkerDialogVisible: false})}>
                            <Dialog.Title style={{alignSelf: 'center'}}>{this.state.trailSelectedMarker.name}</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph style={{marginBottom: 10}}>{this.state.trailSelectedMarker.content}</Paragraph>
                                { this.state.trailSelectedMarker.coords && 
                                    <Paragraph>Latitude: {this.state.trailSelectedMarker.coords.lat}</Paragraph>
                                }
                                { this.state.trailSelectedMarker.coords &&
                                    <Paragraph>Longitude: {this.state.trailSelectedMarker.coords.lng}</Paragraph>
                                }
                                <Image source={this.state.trailSelectedMarker.imgURL ? {uri: this.state.trailSelectedMarker.imgURL} : null} style={{alignSelf: 'center', marginTop: 20, width: 300, height: 200}} />
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => this.setState({isTrailSelectedMarkerDialogVisible: false})}>Ok</Button>
                            </Dialog.Actions>
                        </Dialog>
                        <Dialog visible={this.state.isStartTrailDialogVisible} onDismiss={() => this.setState({isStartTrailDialogVisible: false})}>
                            <Dialog.Title>Iniciar percurso</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>Deseja iniciar este percurso?</Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => this.checkStartTrail()}>Sim</Button>
                                <Button onPress={() => this.setState({isStartTrailDialogVisible: false})}>Não</Button>
                            </Dialog.Actions>
                        </Dialog>
                        <Dialog visible={this.state.isStartTrailQuizzDialogVisible} onDismiss={() => this.setState({isStartTrailQuizzDialogVisible: false})}>
                            <Dialog.Title>Desafio</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>Este percurso tem um desafio associado. Deseja participar?</Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => this.startTrail(true)}>Sim</Button>
                                <Button onPress={() => this.startTrail(false)}>Não</Button>
                            </Dialog.Actions>
                        </Dialog>
                        <Dialog visible={this.state.isEndTrailDialogVisible} onDismiss={() => this.setState({isEndTrailDialogVisible: false})}>
                            <Dialog.Title>Terminar percurso</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>Deseja terminar este percurso?</Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => this.endTrail()}>Sim</Button>
                                <Button onPress={() => this.setState({isEndTrailDialogVisible: false})}>Não</Button>
                            </Dialog.Actions>
                        </Dialog>
                        <Dialog visible={this.state.isFarAwayDialogVisible} onDismiss={() => this.setState({isFarAwayDialogVisible: false})}>
                            <Dialog.Title>Erro ao iniciar percurso</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>Aproxime-se do marcador inicial para iniciar o percurso!</Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => this.setState({isFarAwayDialogVisible: false})}>Ok</Button>
                            </Dialog.Actions>
                        </Dialog>
                        <Dialog visible={this.state.isTrailQuizzQuestionDialogVisible} onDismiss={() => this.setState({isTrailQuizzQuestionDialogVisible: false})}>
                            <Dialog.Title>Questão</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph style={{paddingBottom: 10}}>
                                    {this.state.trailQuizzCurrentQuestion.question}
                                </Paragraph>
                                <RadioButton.Group
                                    onValueChange={value => this.setState({trailQuizzCurrentAnswer: value})}
                                    value={this.state.trailQuizzCurrentAnswer}>
                                    <View style={{flexDirection: 'row'}}>
                                        <RadioButton value="a" />
                                        <Text style={{padding: 5}}>{this.state.trailQuizzCurrentQuestion.optionA}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <RadioButton value="b" />
                                        <Text style={{padding: 5}}>{this.state.trailQuizzCurrentQuestion.optionB}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <RadioButton value="c" />
                                        <Text style={{padding: 5}}>{this.state.trailQuizzCurrentQuestion.optionC}</Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <RadioButton value="d" />
                                        <Text style={{padding: 5}}>{this.state.trailQuizzCurrentQuestion.optionD}</Text>
                                    </View>
                                </RadioButton.Group>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => this.checkTrailQuizzQuestion()}>Ok</Button>
                            </Dialog.Actions>
                        </Dialog>
                        <Dialog visible={this.state.isTrailStatsDialogVisible} onDismiss={() => this.setState({isTrailStatsDialogVisible: false})}>
                            <Dialog.Title>Fim do percurso</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>Tempo: {this.convertTime(this.state.finalTime)}</Paragraph>
                                <Paragraph>Distância: {this.state.finalDistance} m</Paragraph>
                                { this.state.isTrailQuizzActive && 
                                    <Paragraph>
                                        Questões corretas: {this.state.trailQuizzCorrectAnswerCount} de {this.state.totalTrailQuizzQuestions}
                                    </Paragraph>
                                }
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => this.checkEndTrail()}>Ok</Button>
                            </Dialog.Actions>
                        </Dialog>
                        <Dialog visible={this.state.isTrailReviewDialogVisible} onDismiss={() => this.setState({isTrailReviewDialogVisible: false})}>
                            <Dialog.Title>Avaliar</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>Como avalia o seu percurso?</Paragraph>
                            </Dialog.Content>
                            <Rating
                                type={'star'}
                                imageSize={20}
                                ratingCount={5}
                                startingValue={0}
                                onFinishRating={(rating) => this.setState({trailReviewRating: rating})}
                            />
                            <Dialog.Actions>
                                <Button onPress={() => this.submitTrailReview()}>Submeter</Button>
                                <Button onPress={() => this.setState({isTrailReviewDialogVisible: false})}>Ignorar</Button>
                            </Dialog.Actions>
                        </Dialog>
                  </Portal>
                </View>
                <UserMenu />
            </Wallpaper>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    map: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT - 350,
    },
    trailView: {
        flex: 1,
        position: 'absolute',
        top: 460,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT - 540,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
    trailTitleText: {
        paddingTop: 20,
        paddingLeft: 10,
        marginBottom: 20,
        fontSize: 16,
        fontWeight: '900',
        color: 'black',
    },
    trailDescriptionText: {
        padding: 10,
        marginBottom: 20,
        color: 'black',
    },
    trailImage: {
        margin: 10,
        width: 200,
        height: 200,
        resizeMode: 'cover',
    },
    trailMarkerCallout: {
        flex: 1,
        alignItems: 'center',
    },
    trailMarkerCalloutView: {
        paddingTop: 10,
        width: 100,
        height: 100,
        alignItems: 'center',
    },
    trailMarkerCalloutText: {
        fontSize: 12,
        fontWeight: '400',
        color: 'black',
    },
    trailMarkerCalloutImage: {
        width: 100,
        height: 100,
    },
    startButton: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3792CB',
        top: -50,
        left: 300,
        width: 100,
        height: 40,
        borderRadius: 20,
        zIndex: 100,
    },
    endButton: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#CB3737',
        top: -50,
        left: 300,
        width: 100,
        height: 40,
        borderRadius: 20,
        zIndex: 100,
    },
    buttonText: {
        color: 'white',
        backgroundColor: 'transparent',
    },
    statsView: {
        position: 'absolute',
        top: 100,
    },
    quizzStatsView: {
        position: 'absolute',
        top: 140,
    },
    statsText: {
        color: 'black',
        backgroundColor: 'transparent',
    },
});
