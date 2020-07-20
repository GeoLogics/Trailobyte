import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { Rating } from 'react-native-ratings';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export default class UserTrail extends React.Component {
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View style={styles.trailWrapper}>
                    <View style={styles.trailDetails}>
                        <Text style={styles.trailTitle}>
                            {this.props.name}
                        </Text>
                        <Text style={styles.trailText}>
                            Autor: {this.props.author}
                        </Text>
                        <Text style={styles.trailText}>
                            Distância: {this.props.distance} km
                        </Text>
                        <View style={styles.trailRatingView}>
                            <Text style={styles.trailText}>
                                Avaliação:
                            </Text>
                            <Rating style={{paddingLeft: 5}}
                                type={'star'}
                                imageSize={20}
                                ratingCount={5}
                                startingValue={this.props.rating}
                                readonly={true}
                            />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

UserTrail.propTypes = {
    name: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    distance: PropTypes.number.isRequired,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    rating: PropTypes.number,
    numRatings: PropTypes.number,
    onPress: PropTypes.func,
};

const styles = StyleSheet.create({
    trailWrapper: {
        borderBottomColor: 'black',
        borderBottomWidth: 2,
    },
    trailDetails: {
        margin: 10,
    },
    trailTitle: {
        paddingBottom: 10,
        fontSize: 18,
        fontWeight: '900',
        color: 'black',
    },
    trailText: {
        color: 'black',
    },
    trailRatingView: {
        flex: 1,
        flexDirection: 'row',
    },
});
