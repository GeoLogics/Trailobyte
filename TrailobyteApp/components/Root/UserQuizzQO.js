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
                <Text style={styles.text}>Quest&#227;o {this.props.counter}</Text>
                <ScrollView style={styles.question}>  
                    <Text style={styles.text}>{this.props.enunciated}</Text>
                </ScrollView>
                <ScrollView style={styles.question}>  
                    <Text style={styles.text}>{this.props.question}</Text>
                </ScrollView>
                
                <ScrollView nestedScrollEnabled = {true}>
                    <View style={styles.textViewOptionMain} >
                        <Text style={styles.textOption}>Op&#231;&#227;o A</Text>
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
                        <Text style={styles.textOption}>Op&#231;&#227;o B</Text>
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
                        <Text style={styles.textOption}>Op&#231;&#227;o C</Text>
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
                        <Text style={styles.textOption}>Op&#231;&#227;o D</Text>
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
                        <Text style={styles.textOption}>Op&#231;&#227;o E</Text>
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
        marginTop: -42,
        marginLeft: 35,
        borderWidth: 3,
        padding: 0,
     },
     orderInput: {
        borderColor: 'black',
        borderWidth: 3,
        backgroundColor: 'silver',
        width:30,
        height: 40,
        marginTop:0,
     },
     numberInput: {
        marginTop: -3,
        width:100,
     },
});
