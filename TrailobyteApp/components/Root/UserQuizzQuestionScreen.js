import React from "react";
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, Easing, Dimensions, Alert } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import MapView, { Marker, Polyline } from 'react-native-maps';
import AsyncStorage from '@react-native-community/async-storage';

import Wallpaper from './Wallpaper';
import UserQuizzQMC from './UserQuizzQMC';
import UserQuizzQO from './UserQuizzQO';
import UserQuizzQTF from './UserQuizzQTF';
import UserQuizzFinishButton from './UserQuizzFinishButton';

import {targetUri as appEngineUri} from '../../app.json';

export default class UserQuizzQuestionScreen extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            username: '',
            verifier: '',
            question: [],
            questionType: 0,
            questionCounter: 0,
            answerCounter: 0,
            numberOfQMC: 0,
            numberOfQO: 0,
            numberOfQTF: 0,
            questionsQMC: [],
            questionsQO: [],
            questionsQTF: [],
        };
        
        this.getNumberOfQuestions = this.getNumberOfQuestions.bind(this);
        this.getQuestion = this.getQuestion.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.finishQuizz = this.finishQuizz.bind(this);
    }
    
    componentDidMount() {
        this.getNumberOfQuestions('QMC');
        this.getNumberOfQuestions('QO');
        this.getNumberOfQuestions('QTF');
        this.nextQuestion(true);
    }
    
    nextQuestion(skip) {
        if ((this.state.questionCounter > 0) && !skip) {
            if (this.state.questionType == 0) {
                if (this.qmcForm.state.selectedOption == this.state.question.correctOption) {
                    this.setState({answerCounter: this.state.answerCounter + 1});
                }
            } else if (this.state.questionType == 1) {
                if (this.state.question.options) {
                    if ((("option" + this.qoForm.state.orderOption1) == this.state.question.byOrder.byOrder[0])
                        && (("option" + this.qoForm.state.orderOption2) == this.state.question.byOrder.byOrder[1])
                        && (("option" + this.qoForm.state.orderOption3) == this.state.question.byOrder.byOrder[2])
                        && (("option" + this.qoForm.state.orderOption4) == this.state.question.byOrder.byOrder[3])
                        && (("option" + this.qoForm.state.orderOption5) == this.state.question.byOrder.byOrder[4])) {
                        this.setState({answerCounter: this.state.answerCounter + 1});
                    }
                }
            } else if (this.state.questionType == 2) {
                if (this.state.question.answersList) {
                    if ((this.qtfForm.state.selectedAnswer1 == this.state.question.answersList.answersList[0])
                        && (this.qtfForm.state.selectedAnswer2 == this.state.question.answersList.answersList[1])
                        && (this.qtfForm.state.selectedAnswer3 == this.state.question.answersList.answersList[2])
                        && (this.qtfForm.state.selectedAnswer4 == this.state.question.answersList.answersList[3])) {
                        this.setState({answerCounter: this.state.answerCounter + 1});
                    }
                }
            }
        }
        
        var nextType = Math.floor(Math.random() * 3);
        this.setState({questionType: nextType});
        this.setState({questionCounter: this.state.questionCounter + 1});
        
        if (nextType == 0) {
            var nextQMCId = Math.floor(Math.random() * this.state.numberOfQMC) + 1;
            if (this.state.questionsQMC && this.state.questionsQMC.length > 0) {
                if (this.state.questionsQMC.every((id) => id == nextQMCId)) {
                    do {
                        nextQMCId = Math.floor(Math.random() * this.state.numberOfQMC) + 1;
                    } while (id == nextQMCId);
                }
            }
            this.state.questionsQMC.push(nextQMCId);
            this.getQuestion('QMC', nextQMCId.toString());
        } else if (nextType == 1) {
            var nextQOId = Math.floor(Math.random() * this.state.numberOfQO) + 1;
            if (this.state.questionsQO && this.state.questionsQO.length > 0) {
                if (this.state.questionsQO.every((id) => id == nextQOId)) {
                    do {
                        nextQOId = Math.floor(Math.random() * this.state.numberOfQO) + 1;
                    } while (id == nextQOId);
                }
            }
            this.state.questionsQO.push(nextQOId);
            this.getQuestion('QO', nextQOId.toString());
        } else if (nextType == 2) {
            var nextQTFId = Math.floor(Math.random() * this.state.numberOfQTF) + 1;
            if (this.state.questionsQTF && this.state.questionsQTF.length > 0) {
                if (this.state.questionsQTF.every((id) => id == nextQTFId)) {
                    do {
                        nextQTFId = Math.floor(Math.random() * this.state.numberOfQTF) + 1;
                    } while (id == nextQTFId);
                }
            }
            this.state.questionsQTF.push(nextQTFId);
            this.getQuestion('QTF', nextQTFId.toString());
        }
    }
    
    showQuestion() {
        if (this.state.questionType == 0) {
            return (<UserQuizzQMC
                        ref = {qmcForm => {this.qmcForm = qmcForm}}
                        counter={this.state.questionCounter}
                        enunciated={this.state.question.enunciated}
                        question={this.state.question.question}
                        optionA={this.state.question.optionA}
                        optionB={this.state.question.optionB}
                        optionC={this.state.question.optionC}
                        optionD={this.state.question.optionD}
                    >
                    </UserQuizzQMC >);
        } else if (this.state.questionType == 1) {
            return (<UserQuizzQO
                        ref = {qoForm => {this.qoForm = qoForm}}
                        counter={this.state.questionCounter}
                        enunciated={this.state.question.enunciated}
                        question={this.state.question.question}
                        options={this.state.question.options}
                    >
                    </UserQuizzQO >);
        } else if (this.state.questionType == 2) {
            return (<UserQuizzQTF
                        ref = {qtfForm => {this.qtfForm = qtfForm}}
                        counter={this.state.questionCounter}
                        enunciated={this.state.question.enunciated}
                        question={this.state.question.question}
                        questionsList={this.state.question.questionsList}
                    >
                    </UserQuizzQTF >);
        }
    }
    
    showButtons() {
        if (this.state.questionCounter < 10) {
            return (<View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => this.nextQuestion(false)}
                            activeOpacity={1}>
                                <Text style={styles.text}>SEGUINTE</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => this.nextQuestion(true)}
                            activeOpacity={1}>
                                <Text style={styles.text}>SALTAR</Text>
                        </TouchableOpacity>
                    </View>);
        } else {
            return (<UserQuizzFinishButton
                        finishQuizz = {this.finishQuizz}/>);
        }
    }
    
    finishQuizz() {
        Alert.alert("Resultado", this.state.answerCounter + "/" + this.state.questionCounter);
        Actions.userQuizzScreen();
    }
    
    async getNumberOfQuestions(questionType) {
        try {
            // Get items from AsyncStorage
            const usernameValue = await AsyncStorage.getItem('username');
            const verifierValue = await AsyncStorage.getItem('verifier');
            
            // Set current username
            if (usernameValue !== null) {
                console.log(usernameValue);
                this.setState({username: usernameValue});
            }
            
            // Set current verifier
            if (verifierValue !== null) {
                console.log(verifierValue);
                this.setState({verifier: verifierValue});
            }
        } catch (error) {
            // Failed to load data from AsyncStorage
        }
        
        await fetch(appEngineUri + '/rest/question/getLastID?type=' + questionType + 'ID', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'username' : this.state.username,
                'Authorization' : 'Bearer ' + this.state.verifier,
            },
        })
        .then(function(response) {
                console.log(response);
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(response.status);
                }
            })
        .then(data => {
            console.log(data);
            if (questionType == 'QMC')
                this.setState({numberOfQMC: data});
            else if (questionType == 'QO')
                this.setState({numberOfQO: data});
            else if (questionType == 'QTF')
                this.setState({numberOfQTF: data});
        })
        .catch((error) => { alert(error); })
        .done();
    }
    
    async getQuestion(questionType, questionId) {
        try {
            // Get items from AsyncStorage
            const usernameValue = await AsyncStorage.getItem('username');
            const verifierValue = await AsyncStorage.getItem('verifier');
            
            // Set current username
            if (usernameValue !== null) {
                console.log(usernameValue);
                this.setState({username: usernameValue});
            }
            
            // Set current verifier
            if (verifierValue !== null) {
                console.log(verifierValue);
                this.setState({verifier: verifierValue});
            }
        } catch (error) {
            // Failed to load data from AsyncStorage
        }
        
        await fetch(appEngineUri + '/rest/question/OPG' + questionType + '1OP/' + questionId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'username' : this.state.username,
                'Authorization' : 'Bearer ' + this.state.verifier,
            },
        })
        .then(function(response) {
                console.log(response);
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(response.status);
                }
            })
        .then(data => {
            console.log(data);
            this.setState({question: data});
        })
        .catch((error) => { alert(error); })
        .done();
    }
    
    render() {
        return (
            <Wallpaper>
                <View style={styles.container}>
                    {this.showQuestion()}
                    {this.showButtons()}
                </View>
            </Wallpaper>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    buttonContainer: {
        flex: 1,
        marginTop: 20,
        marginBottom: 20,
        marginRight: -20,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3792CB',
        marginRight: 20,
        height: 40,
        width: 100,
        borderRadius: 20,
        zIndex: 100,
    },
    text: {
        color: 'white',
        backgroundColor: 'transparent',
    },
});
