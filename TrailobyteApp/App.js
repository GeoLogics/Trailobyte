import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import Login from "./components/Login";

export default class App extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Login />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});