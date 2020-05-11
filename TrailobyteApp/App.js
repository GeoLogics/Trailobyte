import React from "react";
import { ImageBackground, StyleSheet, Text, View, Button } from "react-native";

import Login from "./components/Login";
import Register from "./components/Register";

export default class App extends React.Component {
    gotoLogin() {
    }

    gotoRegister() {
    }

    render() {
        return (
			<ImageBackground source={require('./images/mountains.jpg')} style={styles.background}>
				<View style={styles.container}>
					<View style={{marginTop:100, marginLeft:80, marginRight:80}} >
						<Button title="Registo" onPress={this.gotoRegister()}></Button>
					</View>
					<View style={{marginTop:20, marginLeft:80, marginRight:80}} >
						<Button title="Login" onPress={this.gotoLogin()}></Button>
					</View>
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