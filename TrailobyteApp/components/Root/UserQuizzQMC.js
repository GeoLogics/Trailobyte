import React from "react";
import PropTypes from 'prop-types';
import { StyleSheet, View, ScrollView, Text, Image, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { RadioButton, Colors } from 'react-native-paper';

export default class UserQuizzQMC extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selectedOption: '',
        };
    }
    
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Op&#231;&#227;o {this.props.counter}</Text>
                <ScrollView style={styles.question}>  
                    <Text style={styles.text}>{this.props.enunciated}</Text>
                </ScrollView>
                <ScrollView style={styles.question}>  
                    <Text style={styles.text}>{this.props.question}</Text>
                </ScrollView>
                <ScrollView nestedScrollEnabled = {true}>
                    <RadioButton.Group
                        onValueChange={selectedOption => this.setState({ selectedOption })}
                        value={this.state.selectedOption}>
                            <View style={styles.textViewOptionMain} >
                                <Text style={styles.textOption}>Op&#231;&#227;o A</Text>
                                <View style={styles.radioButtons} >
                                    <RadioButton 
                                        value = "A" 
                                        color={Colors.orange100} 
                                        uncheckedColor={Colors.orange100}
                                    />
                                </View>
                                <View style={styles.textViewOption} >
                                    <ScrollView nestedScrollEnabled = {true}>
                                        <Text>
                                            {this.props.optionA}
                                        </Text>
                                    </ScrollView>
                                </View>
                            </View>
                            
                            <View style={styles.textViewOptionMain} >
                                <Text style={styles.textOption}>Op&#231;&#227;o B</Text>
                                <View style={styles.radioButtons} >
                                    <RadioButton 
                                        value = "B" 
                                        color={Colors.orange100} 
                                        uncheckedColor={Colors.orange100}
                                    />
                                </View>
                                <View style={styles.textViewOption} >
                                    <ScrollView nestedScrollEnabled = {true}>
                                        <Text>
                                            {this.props.optionB}
                                        </Text>
                                    </ScrollView>
                                </View>
                            </View>
                            
                            <View style={styles.textViewOptionMain} >
                                <Text style={styles.textOption}>Op&#231;&#227;o C</Text>
                                <View style={styles.radioButtons} >
                                    <RadioButton 
                                        value = "C" 
                                        color={Colors.orange100} 
                                        uncheckedColor={Colors.orange100}
                                    />
                                </View>
                                <View style={styles.textViewOption} >
                                    <ScrollView nestedScrollEnabled = {true}>
                                        <Text>
                                            {this.props.optionC}
                                        </Text>
                                    </ScrollView>
                                </View>
                            </View>
                            
                            <View style={styles.textViewOptionMain} >
                                <Text style={styles.textOption}>Op&#231;&#227;o D</Text>
                                <View style={styles.radioButtons} >
                                    <RadioButton 
                                        value = "D" 
                                        color={Colors.orange100} 
                                        uncheckedColor={Colors.orange100}
                                    />
                                </View>
                                <View style={styles.textViewOption} >
                                    <ScrollView nestedScrollEnabled = {true}>
                                        <Text>
                                            {this.props.optionD}
                                        </Text>
                                    </ScrollView>
                                </View>
                            </View>
                    </RadioButton.Group>
                </ScrollView>
            </View>
        );
    }
}

UserQuizzQMC.propTypes = {
    counter: PropTypes.number,
    enunciated: PropTypes.string,
    question: PropTypes.string,
    optionA: PropTypes.string,
    optionB: PropTypes.string,
    optionC: PropTypes.string,
    optionD: PropTypes.string,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    question: {
        maxHeight: 400,
        marginBottom: 10,
        marginTop: 10,
    },
    text: {
        marginBottom: 10,
        alignSelf: 'center',
        color: 'white',
        backgroundColor: 'transparent',
    },
    textOption: {
        marginLeft: 10,
        fontSize: 16,
        color: Colors.orange500,
        height: 30,
        justifyContent: "flex-start",
        textAlignVertical: 'top',
    },
    textViewOptionMain: {
        top: 10,
    },
    textViewOption: {
        maxHeight: 160,
        borderColor: 'black',
        marginTop: -40,
        marginBottom: 10,
        marginLeft: 35,
        borderWidth: 3,
        padding: 0,
     },
     radioButtons: {
        top: -10,
     },
});
