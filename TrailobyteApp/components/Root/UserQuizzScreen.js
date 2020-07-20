import React from "react";
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import MapView, { Marker, Polyline } from 'react-native-maps';
import AsyncStorage from '@react-native-community/async-storage';

import Wallpaper from './Wallpaper';
import UserMenu from './UserMenu';
import UserQuizzStartButton from './UserQuizzStartButton';

import {targetUri as appEngineUri} from '../../app.json';

export default class UserQuizzScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    
    startQuizz() {
        Actions.userQuizzQuestionScreen();
    }
    
    render() {
        return (
            <Wallpaper>
                <View style={styles.container}>
                    <View style={styles.ranking}>
                        <Text style={styles.title}>
                            Ranking
                        </Text>
                    </View>
                    <UserQuizzStartButton
                        startQuizz = {this.startQuizz}/>
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
    ranking: {
        alignSelf: 'center',
        marginTop: 40,
        padding: 10,
        borderWidth: 1,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(55, 146, 203, 0.5)',
    },
    title: {
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: '900',
        color: 'white',
        textDecorationLine: 'underline',
    },
});
