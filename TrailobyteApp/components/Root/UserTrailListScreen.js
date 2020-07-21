import React from "react";
import PropTypes from 'prop-types';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, Animated, Easing, Dimensions, PermissionsAndroid } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Searchbar } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-community/async-storage';

import Wallpaper from './Wallpaper';
import UserMenu from './UserMenu';
import UserTrail from './UserTrail';

import {targetUri as appEngineUri} from '../../app.json';

const {width, height} = Dimensions.get('window')

const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width / height

export default class UserTrailListScreen extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            listType: null,
            allTrails: [],
            userTrails: [],
            ratingTrails: [],
            userCursor: null,
            ratingCursor: null,
            search: '',
            username: '',
            verifier: ''
        };
        
        this.queryAllTrails = this.queryAllTrails.bind(this);
        this.queryTrailByRating = this.queryTrailByRating.bind(this);
        this.queryTrailByUsername = this.queryTrailByUsername.bind(this);
        this.renderTrailList = this.renderTrailList.bind(this);
    }
    
    componentDidMount() {
        this.queryAllTrails();
        this.queryTrailByRating();
        this.queryTrailByUsername();
    }
    
    async queryAllTrails() {
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
        
        await fetch(appEngineUri + '/rest/query/listTrails', {
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
                } else {
                    throw new Error(response.status);
                }
            })
        .then(data => {
            console.log(data);
            this.setState({allTrails: data.resultList});
        })
        .catch((error) => { console.log(error); })
        .done();
    }

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
        .catch((error) => { console.log(error); })
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
        .catch((error) => { console.log(error); })
        .done();
    }
    
    openTrail(trailName) {
        Actions.userTrailScreen({trail: trailName});
    }
    
    renderTrailList() {
        if (this.state.listType == 'user') {
            if (this.state.userTrails && this.state.userTrails.length) {
                return this.state.userTrails.map((trail, index) => {
                    if (trail.name.includes(this.state.search)) {
                        return (<UserTrail
                                key={index}
                                name={trail.name}
                                author={trail.creator}
                                distance={trail.dist}
                                start={trail.start}
                                end={trail.end}
                                rating={trail.avgRating}
                                numRatings={trail.nRatings}
                                onPress={() => this.openTrail(trail.name)}
                                >
                                </UserTrail >);
                    }
                });
            }
        } else if (this.state.listType == 'rating') {
            if (this.state.ratingTrails && this.state.ratingTrails.length) {
                return this.state.ratingTrails.map((trail, index) => {
                    if (trail.name.includes(this.state.search)) {
                        return (<UserTrail
                                key={index}
                                name={trail.name}
                                author={trail.creator}
                                distance={trail.dist}
                                start={trail.start}
                                end={trail.end}
                                rating={trail.avgRating}
                                numRatings={trail.nRatings}
                                onPress={() => this.openTrail(trail.name)}
                                >
                                </UserTrail >);
                    }
                });
            }
        } else {
            if (this.state.allTrails && this.state.allTrails.length) {
                return this.state.allTrails.map((trail, index) => {
                    if (trail.name.includes(this.state.search)) {
                        return (<UserTrail
                                key={index}
                                name={trail.name}
                                author={trail.creator}
                                distance={trail.dist}
                                start={trail.start}
                                end={trail.end}
                                rating={trail.avgRating}
                                numRatings={trail.nRatings}
                                onPress={() => this.openTrail(trail.name)}
                                >
                                </UserTrail >);
                    }
                });
            }
        }
        
    }
    
    updateSearch = (search) => {
        this.setState({ search });
    };
    
    render() {
        return (
            <Wallpaper>
                <View style={styles.container}>
                    <View style={styles.searchView}>
                        <Searchbar
                            style={styles.searchBar}
                            placeholder="Pesquisar"
                            onChangeText={this.updateSearch}
                            value={this.state.search}
                        />
                    </View>
                    <DropDownPicker
                        items={[
                            {label: 'Todos', value: 'all'},
                            {label: 'Meus', value: 'user'},
                            {label: 'Top 5', value: 'rating'},
                        ]}
                        placeholder="Filtrar"
                        defaultValue={this.state.listType}
                        containerStyle={styles.filterDropDown}
                        style={{backgroundColor: '#fafafa'}}
                        itemStyle={{
                            justifyContent: 'flex-start'
                        }}
                        dropDownStyle={{backgroundColor: '#fafafa'}}
                        onChangeItem={item => this.setState({
                            listType: item.value
                        })}
                    />
                    <View style={styles.trailView}>
                        <ScrollView>
                            {this.renderTrailList()}
                        </ScrollView>
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
        justifyContent: 'flex-start',
    },
    searchView: {
        width: '100%',
        height: 100,
        paddingLeft: 10,
        paddingTop: 25,
        backgroundColor: '#3792CB',
    },
    searchBar: {
        width: SCREEN_WIDTH - 200,
        height: 50,
    },
    filterDropDown: {
        flex: 1,
        margin: 10,
        top: 15,
        left: 260,
        height: 50,
        width: 120,
        borderRadius: 20,
        position: 'absolute',
    },
    trailView: {
        minHeight: SCREEN_HEIGHT - 180,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
    }
});
