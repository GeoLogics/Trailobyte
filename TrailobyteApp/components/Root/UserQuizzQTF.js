import React from "react";
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView, View, Text, Image, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { RadioButton, Colors } from 'react-native-paper';

export default class UserQuizzQTF extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            selectedAnswer1: '',
            selectedAnswer2: '',
            selectedAnswer3: '',
            selectedAnswer4: '',
        };
    }
    
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Quest&#227;o {this.props.counter}</Text>
                <ScrollView style={styles.question}>  
                    <Text style={styles.text}>{this.props.enunciated}</Text>
                </ScrollView>
                <ScrollView style={styles.question}>  
                    <Text style={styles.text}>{this.props.question}</Text>
                </ScrollView>
                <ScrollView nestedScrollEnabled = {true}>
                    <RadioButton.Group
                        onValueChange={selectedAnswer1 => this.setState({ selectedAnswer1 })}
                        value={this.state.selectedAnswer1}>
                            <View style={styles.textViewOptionMain} >
                                <Text style={styles.textOption}>Quest&#227;o A</Text>
                                <View style={styles.radioButtons} >
                                    <RadioButton 
                                        value = "T" 
                                        color={Colors.green500} 
                                        uncheckedColor={Colors.green500}
                                    />
                                    <RadioButton 
                                        value = "F" 
                                        color={Colors.red500} 
                                        uncheckedColor={Colors.red500}
                                    />
                                </View>
                                <View style={styles.textViewOption} >
                                    <ScrollView nestedScrollEnabled = {true}>
                                        <Text>
                                            {this.props.questionsList ? this.props.questionsList.questions[0] : ''}
                                        </Text>
                                    </ScrollView>
                                </View>
                            </View>
                    </RadioButton.Group>
                    <RadioButton.Group
                        onValueChange={selectedAnswer2 => this.setState({ selectedAnswer2 })}
                        value={this.state.selectedAnswer2}>
                            <View style={styles.textViewOptionMain} >
                                <Text style={styles.textOption}>Quest&#227;o B</Text>
                                <View style={styles.radioButtons} >
                                    <RadioButton 
                                        value = "T" 
                                        color={Colors.green500} 
                                        uncheckedColor={Colors.green500}
                                    />
                                    <RadioButton 
                                        value = "F" 
                                        color={Colors.red500} 
                                        uncheckedColor={Colors.red500}
                                    />
                                </View>
                                <View style={styles.textViewOption} >
                                    <ScrollView nestedScrollEnabled = {true}>
                                        <Text>
                                            {this.props.questionsList ? this.props.questionsList.questions[1] : ''}
                                        </Text>
                                    </ScrollView>
                                </View>
                            </View>
                    </RadioButton.Group>
                    <RadioButton.Group
                        onValueChange={selectedAnswer3 => this.setState({ selectedAnswer3 })}
                        value={this.state.selectedAnswer3}>
                            <View style={styles.textViewOptionMain} >
                                <Text style={styles.textOption}>Quest&#227;o C</Text>
                                <View style={styles.radioButtons} >
                                    <RadioButton 
                                        value = "T" 
                                        color={Colors.green500} 
                                        uncheckedColor={Colors.green500}
                                    />
                                    <RadioButton 
                                        value = "F" 
                                        color={Colors.red500} 
                                        uncheckedColor={Colors.red500}
                                    />
                                </View>
                                <View style={styles.textViewOption} >
                                    <ScrollView nestedScrollEnabled = {true}>
                                        <Text>
                                            {this.props.questionsList ? this.props.questionsList.questions[2] : ''}
                                        </Text>
                                    </ScrollView>
                                </View>
                            </View>
                    </RadioButton.Group>
                    <RadioButton.Group
                        onValueChange={selectedAnswer4 => this.setState({ selectedAnswer4 })}
                        value={this.state.selectedAnswer4}>
                            <View style={styles.textViewOptionMain} >
                                <Text style={styles.textOption}>Quest&#227;o D</Text>
                                <View style={styles.radioButtons} >
                                    <RadioButton 
                                        value = "T" 
                                        color={Colors.green500} 
                                        uncheckedColor={Colors.green500}
                                    />
                                    <RadioButton 
                                        value = "F" 
                                        color={Colors.red500} 
                                        uncheckedColor={Colors.red500}
                                    />
                                </View>
                                <View style={styles.textViewOption} >
                                    <ScrollView nestedScrollEnabled = {true}>
                                        <Text>
                                            {this.props.questionsList ? this.props.questionsList.questions[3] : ''}
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

UserQuizzQTF.propTypes = {
    counter: PropTypes.number,
    enunciated: PropTypes.string,
    question: PropTypes.string,
    questionsList: PropTypes.object,
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
        marginTop: -78,
        marginBottom: 10,
        marginLeft: 35,
        borderWidth: 3,
        padding: 0,
     },
     radioButtons: {
        top: -20,
        marginTop: 10,
     },
});
