import React from "react";
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView, View, Text, TextInput, Image, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { Colors } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';

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
                        <View style={styles.textViewOptionMain} >
                            <Text style={styles.textOption}>Opção A</Text>
                            <DropDownPicker
                                items={[
                                    {label: '1', value: '1'},
                                    {label: '2', value: '2'},
                                    {label: '3', value: '3'},
                                    {label: '4', value: '4'},
                                    {label: '5', value: '5'},
                                ]}
                                placeholder="1"
                                defaultValue={this.state.orderOption1}
                                containerStyle={styles.numberDropDown}
                                style={{backgroundColor: '#fafafa'}}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                dropDownStyle={{backgroundColor: '#fafafa'}}
                                dropDownMaxHeight={50}
                                onChangeItem={item => this.setState({
                                    orderOption1: item.value
                                })}
                            />
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
                            <DropDownPicker
                                items={[
                                    {label: '1', value: '1'},
                                    {label: '2', value: '2'},
                                    {label: '3', value: '3'},
                                    {label: '4', value: '4'},
                                    {label: '5', value: '5'},
                                ]}
                                placeholder="1"
                                defaultValue={this.state.orderOption2}
                                containerStyle={styles.numberDropDown}
                                style={{backgroundColor: '#fafafa'}}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                dropDownStyle={{backgroundColor: '#fafafa'}}
                                dropDownMaxHeight={50}
                                onChangeItem={item => this.setState({
                                    orderOption2: item.value
                                })}
                            />
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
                            <DropDownPicker
                                items={[
                                    {label: '1', value: '1'},
                                    {label: '2', value: '2'},
                                    {label: '3', value: '3'},
                                    {label: '4', value: '4'},
                                    {label: '5', value: '5'},
                                ]}
                                placeholder="1"
                                defaultValue={this.state.orderOption3}
                                containerStyle={styles.numberDropDown}
                                style={{backgroundColor: '#fafafa'}}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                dropDownStyle={{backgroundColor: '#fafafa'}}
                                dropDownMaxHeight={50}
                                onChangeItem={item => this.setState({
                                    orderOption3: item.value
                                })}
                            />
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
                            <DropDownPicker
                                items={[
                                    {label: '1', value: '1'},
                                    {label: '2', value: '2'},
                                    {label: '3', value: '3'},
                                    {label: '4', value: '4'},
                                    {label: '5', value: '5'},
                                ]}
                                placeholder="1"
                                defaultValue={this.state.orderOption4}
                                containerStyle={styles.numberDropDown}
                                style={{backgroundColor: '#fafafa'}}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                dropDownStyle={{backgroundColor: '#fafafa'}}
                                dropDownMaxHeight={50}
                                onChangeItem={item => this.setState({
                                    orderOption4: item.value
                                })}
                            />
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
                            <DropDownPicker
                                items={[
                                    {label: '1', value: '1'},
                                    {label: '2', value: '2'},
                                    {label: '3', value: '3'},
                                    {label: '4', value: '4'},
                                    {label: '5', value: '5'},
                                ]}
                                placeholder="1"
                                defaultValue={this.state.orderOption5}
                                containerStyle={styles.numberDropDown}
                                style={{backgroundColor: '#fafafa'}}
                                itemStyle={{
                                    justifyContent: 'flex-start'
                                }}
                                dropDownStyle={{backgroundColor: '#fafafa'}}
                                dropDownMaxHeight={50}
                                onChangeItem={item => this.setState({
                                    orderOption5: item.value
                                })}
                            />
                            <View style={styles.textViewOption} >
                                <ScrollView nestedScrollEnabled = {true}>
                                    <Text>
                                        {this.props.options ? this.props.options.options[4] : ''}
                                    </Text>
                                </ScrollView>
                            </View>
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
        marginTop: -50,
        marginBottom: 20,
        marginLeft: 70,
        marginRight: 20,
        borderWidth: 2,
     },
     numberDropDown: {
        margin: 10,
        height: 40,
        width: 55,
    },
});
