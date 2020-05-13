import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import Root from "./components/Root";

export default class App extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Root />
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