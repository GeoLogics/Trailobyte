import React from "react";
import { ImageBackground, StyleSheet, Text, View, Button } from "react-native";

export default class Register extends React.Component {
    render() {
        return (
			<ImageBackground source={require('../images/mountains.jpg')} style={styles.background}>
				<View style={styles.container}>
				</View>
			</ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "center"
	},
	background: {
		flex: 1,
		width: '100%',
        height: '100%',
		resizeMode: "cover",
		justifyContent: "center"
	}
});