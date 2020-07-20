import React from "react";
import { StyleSheet, View } from "react-native";
import { Provider as PaperProvider } from 'react-native-paper';

import Root from "./components/Root";

export default class App extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <PaperProvider>
                    <Root />
                </PaperProvider>
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