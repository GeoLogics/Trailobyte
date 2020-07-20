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
                <Text style={styles.text}>Questão {this.props.counter}</Text>
                <View style={styles.question}>
                    <ScrollView style={{marginBottom: 10}}>  
                        <Text style={styles.text}>{this.props.enunciated}</Text>
                    </ScrollView>
                    <ScrollView>  
                        <Text style={styles.text}>{this.props.question}</Text>
                    </ScrollView>
                </View>
                <View style={styles.answer}>
                    <ScrollView nestedScrollEnabled = {true}>
                        <RadioButton.Group
                            onValueChange={selectedAnswer1 => this.setState({ selectedAnswer1 })}
                            value={this.state.selectedAnswer1}>
                                <View style={styles.textViewOptionMain} >
                                    <Text style={styles.textOption}>Questão A</Text>
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
                                    <Text style={styles.textOption}>Questão B</Text>
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
                                    <Text style={styles.textOption}>Questão C</Text>
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
                                    <Text style={styles.textOption}>Questão D</Text>
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
        flexDirection: 'column',
        alignSelf: 'center',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    question: {
        marginBottom: 20,
        width: 300,
        height: 300,
        justifyContent: 'center',
    },
    answer: {
        width: 300,
        height: 300,
        justifyContent: 'center',
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
    },
    textViewOptionMain: {
        borderWidth: 2,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
    textViewOption: {
        borderColor: 'black',
        backgroundColor: 'white',
        marginTop: -78,
        marginBottom: 20,
        marginLeft: 35,
        marginRight: 35,
        borderWidth: 2,
     },
     radioButtons: {
        top: -20,
        marginTop: 10,
     },
});
