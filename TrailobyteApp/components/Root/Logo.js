import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image } from 'react-native';

import logoImg from '../../images/logo.png';
import titleImg from '../../images/title.png';

export default class Logo extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Image source={logoImg} style={styles.logo} />
                <Image source={titleImg} style={styles.title} />
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
    logo: {
        top: 50,
        width: 120,
        height: 160,
        opacity: 0.8,
    },
    title: {
        top: -10,
        width: 200,
        height: 35,
    },
});
