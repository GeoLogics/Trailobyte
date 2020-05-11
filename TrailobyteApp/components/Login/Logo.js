import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image } from 'react-native';

import logoImg from '../../images/logo.png';

export default class Logo extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Image source={logoImg} style={styles.image} />
                <Text style={styles.text}>Trailobyte</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 150,
        height: 200,
    },
    text: {
        color: '#444444',
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'monospace',
        backgroundColor: 'transparent',
        marginTop: 20,
    },
});
