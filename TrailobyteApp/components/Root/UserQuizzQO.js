import React from "react";
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView, View, Text, TextInput, Image, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { Colors } from 'react-native-paper';

export default class UserQuizzQO extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            orderOption1: '',
            orderOption2: '',
            orderOption3: '',
            orderOption4: '',
            orderOption5: '',
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
                        <View style={styles.textViewOptionMain} >
                            <Text style={styles.textOption}>Opção A</Text>
                            <View style={styles.orderInput}>
                                <TextInput 
                                    style={styles.numberInput}
                                    keyboardType='numeric'
                                    onChangeText={orderOption1 => this.setState({ orderOption1 })}
                                    value={this.state.orderOption1}
                                    maxLength={1}
                                />
                            </View>
                            <View style={styles.textViewOption} >
                                <ScrollView nestedScrollEnabled = {true}>
                                    <Text>
                                        {this.props.options ? this.props.options.options[0] : ''}
                                    </Text>
                                </ScrollView>
                            </View>
                        </View>
                        <View style={styles.textViewOptionMain} >
                            <Text style={styles.textOption}>Opção B</Text>
                            <View style={styles.orderInput} >
                                <TextInput 
                                    style={styles.numberInput}
                                    keyboardType='numeric'
                                    onChangeText={orderOption2 => this.setState({ orderOption2 })}
                                    value={this.state.orderOption2}
                                    maxLength={1}
                                />
                            </View>
                            <View style={styles.textViewOption} >
                                <ScrollView nestedScrollEnabled = {true}>
                                    <Text>
                                        {this.props.options ? this.props.options.options[1] : ''}
                                    </Text>
                                </ScrollView>
                            </View>
                        </View>
                        <View style={styles.textViewOptionMain} >
                            <Text style={styles.textOption}>Opção C</Text>
                            <View style={styles.orderInput}>
                                <TextInput 
                                    style={styles.numberInput}
                                    keyboardType='numeric'
                                    onChangeText={orderOption3 => this.setState({ orderOption3 })}
                                    value={this.state.orderOption3}
                                    maxLength={1}
                                />
                            </View>
                            <View style={styles.textViewOption} >
                                <ScrollView nestedScrollEnabled = {true}>
                                    <Text>
                                        {this.props.options ? this.props.options.options[2] : ''}
                                    </Text>
                                </ScrollView>
                            </View>
                        </View>
                        <View style={styles.textViewOptionMain} >
                            <Text style={styles.textOption}>Opção D</Text>
                            <View style={styles.orderInput}>
                                <TextInput 
                                    style={styles.numberInput}
                                    keyboardType='numeric'
                                    onChangeText={orderOption4 => this.setState({ orderOption4 })}
                                    value={this.state.orderOption4}
                                    maxLength={1}
                                />
                            </View>
                            <View style={styles.textViewOption} >
                                <ScrollView nestedScrollEnabled = {true}>
                                    <Text>
                                        {this.props.options ? this.props.options.options[3] : ''}
                                    </Text>
                                </ScrollView>
                            </View>
                        </View>
                        <View style={styles.textViewOptionMain} >
                            <Text style={styles.textOption}>Opção E</Text>
                            <View style={styles.orderInput}>
                                <TextInput 
                                    style={styles.numberInput}
                                    keyboardType='numeric'
                                    onChangeText={orderOption5 => this.setState({ orderOption5 })}
                                    value={this.state.orderOption5}
                                    maxLength={1}
                                />
                            </View>
                            <View style={styles.textViewOption} >
                                <ScrollView nestedScrollEnabled = {true}>
                                    <Text>
                                        {this.props.options ? this.props.options.options[4] : ''}
                                    </Text>
                                </ScrollView>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

UserQuizzQO.propTypes = {
    counter: PropTypes.number,
    enunciated: PropTypes.string,
    question: PropTypes.string,
    options: PropTypes.object,
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
        marginTop: -40,
        marginBottom: 20,
        marginLeft: 45,
        marginRight: 35,
        borderWidth: 2,
     },
     orderInput: {
        borderColor: 'black',
        borderWidth: 3,
        backgroundColor: 'silver',
        width:30,
        height: 40,
        marginLeft: 10,
     },
     numberInput: {
        marginTop: -3,
        width: 100,
     },
});
