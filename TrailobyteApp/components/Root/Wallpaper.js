import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, StyleSheet, ImageBackground} from 'react-native';

import wallpaperImg from '../../images/wallpaper.jpg';

export default class Wallpaper extends React.Component {
    render() {
        return (
            <ImageBackground style={styles.picture} source={wallpaperImg}>
                {this.props.children}
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    picture: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
    },
});
