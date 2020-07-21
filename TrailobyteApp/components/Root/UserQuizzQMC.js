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
                <Text style={styles.text}>Questão {this.props.counter}</Text>
                    <ScrollView 
                        contentContainerStyle={{flexGrow: 1}} 
                        style={{marginBottom: 20}}> 
                        <View style={styles.question}>
                            <Text style={styles.text}>{this.props.enunciated}</Text>
                        </View>
                    </ScrollView>
                { this.props.question ? 
                    (<ScrollView 
                        contentContainerStyle={{flexGrow: 1}} 
                        style={{marginBottom: 20}}> 
                        <View style={styles.subQuestion}>
                            <Text style={styles.text}>{this.props.question}</Text>
                        </View>
                     </ScrollView>
                    ) : null
                }
                <ScrollView 
                    contentContainerStyle={{flexGrow: 1}}
                    style={{minHeight: 400}}
                    nestedScrollEnabled = {true}>
                    <View style={styles.answer}>
                        <RadioButton.Group
                            onValueChange={selectedOption => this.setState({ selectedOption })}
                            value={this.state.selectedOption}>
                                <View style={styles.textViewOptionMain} >
                                    <Text style={styles.textOption}>Opção A</Text>
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
                                    <Text style={styles.textOption}>Opção B</Text>
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
                                    <Text style={styles.textOption}>Opção C</Text>
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
                                    <Text style={styles.textOption}>Opção D</Text>
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
                    </View>
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
        flex: 3,
        margin: 20,
        flexDirection: 'column',
        alignSelf: 'center',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    question: {
        flex: 1,
        marginBottom: 20,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    subQuestion: {
        flex: 1,
        marginBottom: 20,
        justifyContent: 'center',
    },
    answer: {
        flex: 1,
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
        marginTop: -40,
        marginBottom: 20,
        marginLeft: 35,
        marginRight: 35,
        borderWidth: 2,
     },
     radioButtons: {
        top: -10,
     },
});
