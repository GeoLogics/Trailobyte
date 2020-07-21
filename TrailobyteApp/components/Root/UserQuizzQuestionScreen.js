import React from "react";
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, Easing, Dimensions, Alert } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Button, RadioButton, Paragraph, Dialog, Portal } from 'react-native-paper';
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
            isQuizzDialogVisible: false,
            isQuizzIncompleteDialogVisible: false,
        };
        
        this.questionsQMC = [];
        this.questionsQO = [];
        this.questionsQTF = [];
        this.numberOfQMC = 1;
        this.numberOfQO = 1;
        this.numberOfQTF = 1;
        
        this.getNumberOfQuestions = this.getNumberOfQuestions.bind(this);
        this.getQuestion = this.getQuestion.bind(this);
        this.getRandomQuestionId = this.getRandomQuestionId.bind(this);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.verifyAnswers = this.verifyAnswers.bind(this);
        this.finishQuizz = this.finishQuizz.bind(this);
        this.exitQuizz = this.exitQuizz.bind(this);
    }
    
    componentDidMount() {
        if (this.props.onRef != null) {
            this.props.onRef(this);
        }
        this.getNumberOfQuestions('QMC');
        this.getNumberOfQuestions('QO');
        this.getNumberOfQuestions('QTF');
        this.nextQuestion(true);
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
                this.numberOfQMC = data;
            else if (questionType == 'QO')
                this.numberOfQO = data;
            else if (questionType == 'QTF')
                this.numberOfQTF = data;
        })
        .catch((error) => { console.log(error); })
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
        .catch((error) => { console.log(error); })
        .done();
    }

    getRandomQuestionId(questionType) {
        if (questionType == 0) {
            if (!this.questionsQMC.length) {
                for (var i = 0; i < this.numberOfQMC; i++) {
                    this.questionsQMC.push(i);
                }
            }
            var index = Math.floor(Math.random() * this.questionsQMC.length);
            var val = this.questionsQMC[index];
            
            this.questionsQMC.splice(index, 1);
            
            return val;
        } else if (questionType == 1) {
            if (!this.questionsQO.length) {
                for (var i = 0; i < this.numberOfQO; i++) {
                    this.questionsQO.push(i);
                }
            }
            var index = Math.floor(Math.random() * this.questionsQO.length);
            var val = this.questionsQO[index];

            this.questionsQO.splice(index, 1);
            
            return val;
        } else if (questionType == 2) {
            if (!this.questionsQTF.length) {
                for (var i = 0; i < this.numberOfQTF; i++) {
                    this.questionsQTF.push(i);
                }
            }
            var index = Math.floor(Math.random() * this.questionsQTF.length);
            var val = this.questionsQTF[index];

            this.questionsQTF.splice(index, 1);
            
            return val;
        }
        
        return 0;
    }
    
    nextQuestion(skip) {
        if ((this.state.questionCounter > 0) && !skip) {
            if ((this.state.questionType == 0) && (this.qmcForm) && (this.qmcForm.state)) {
                if (this.qmcForm.state.selectedOption == this.state.question.correctOption) {
                    this.setState({answerCounter: this.state.answerCounter + 1});
                }
            } else if ((this.state.questionType == 1) && (this.qoForm) && (this.qoForm.state)) {
                if (this.state.question.options) {
                    if ((("option" + this.qoForm.state.orderOption1) == this.state.question.byOrder.byOrder[0])
                        && (("option" + this.qoForm.state.orderOption2) == this.state.question.byOrder.byOrder[1])
                        && (("option" + this.qoForm.state.orderOption3) == this.state.question.byOrder.byOrder[2])
                        && (("option" + this.qoForm.state.orderOption4) == this.state.question.byOrder.byOrder[3])
                        && (("option" + this.qoForm.state.orderOption5) == this.state.question.byOrder.byOrder[4])) {
                        this.setState({answerCounter: this.state.answerCounter + 1});
                    }
                }
            } else if ((this.state.questionType == 2) && (this.qtfForm) && (this.qtfForm.state)) {
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
            var nextQMCId = (this.getRandomQuestionId(nextType) + 1);
            if (nextQMCId > 0) {
                this.getQuestion('QMC', nextQMCId.toString());
            }
            if ((this.qmcForm) && (this.qmcForm.state)) {
                this.qmcForm.state.selectedOption = '';
            }
        } else if (nextType == 1) {
            var nextQOId = (this.getRandomQuestionId(nextType) + 1);
            if (nextQOId > 0) {
                this.getQuestion('QO', nextQOId.toString());
            }
            if ((this.qoForm) && (this.qoForm.state)) {
                this.qoForm.state.orderOption1 = '';
                this.qoForm.state.orderOption2 = '';
                this.qoForm.state.orderOption3 = '';
                this.qoForm.state.orderOption4 = '';
                this.qoForm.state.orderOption5 = '';
            }
        } else if (nextType == 2) {
            var nextQTFId = (this.getRandomQuestionId(nextType) + 1);
            if (nextQTFId > 0) {
                this.getQuestion('QTF', nextQTFId.toString());
            }
            if ((this.qtfForm) && (this.qtfForm.state)) {
                this.qtfForm.state.selectedAnswer1 = '';
                this.qtfForm.state.selectedAnswer2 = '';
                this.qtfForm.state.selectedAnswer3 = '';
                this.qtfForm.state.selectedAnswer4 = '';
            }
        }
    }
    
    verifyAnswers() {
        var isDone = false;
        
        if (this.state.questionCounter > 0) {
            if ((this.state.questionType == 0) && (this.qmcForm) && (this.qmcForm.state)) {
                if (this.qmcForm.state.selectedOption !== '') {
                    isDone = true;
                }
            } else if ((this.state.questionType == 1) && (this.qoForm) && (this.qoForm.state)) {
                if ((this.qoForm.state.orderOption1 !== '') &&
                    (this.qoForm.state.orderOption2 !== '') &&
                    (this.qoForm.state.orderOption3 !== '') &&
                    (this.qoForm.state.orderOption4 !== '') &&
                    (this.qoForm.state.orderOption5 !== '')) {
                    isDone = true;
                }
            } else if ((this.state.questionType == 2) && (this.qtfForm) && (this.qtfForm.state)) {
                if ((this.qtfForm.state.selectedAnswer1 !== '') &&
                    (this.qtfForm.state.selectedAnswer2 !== '') &&
                    (this.qtfForm.state.selectedAnswer3 !== '') &&
                    (this.qtfForm.state.selectedAnswer4 !== '')) {
                    isDone = true;
                }
            }
        }
        
        if (isDone) {
            this.nextQuestion(false);
        } else {
            this.setState({isQuizzIncompleteDialogVisible: true});
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
                            onPress={() => this.verifyAnswers()}
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
        this.setState({isQuizzDialogVisible: true});
    }
    
    exitQuizz() {
        this.setState({isQuizzDialogVisible: false});
        Actions.userQuizzScreen();
    }
    
    render() {
        return (
            <Wallpaper>
                <View style={styles.container}>
                    {this.showQuestion()}
                    {this.showButtons()}
                    <Portal>
                        <Dialog visible={this.state.isQuizzIncompleteDialogVisible} onDismiss={() => this.setState({isQuizzIncompleteDialogVisible: false})}>
                            <Dialog.Title>Incompleto</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>Por favor responda a todas as questões!</Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => this.setState({isQuizzIncompleteDialogVisible: false})}>Ok</Button>
                            </Dialog.Actions>
                        </Dialog>
                        <Dialog visible={this.state.isQuizzDialogVisible} onDismiss={() => this.setState({isQuizzDialogVisible: false})}>
                            <Dialog.Title>Resultado</Dialog.Title>
                            <Dialog.Content>
                                <Paragraph>Respondeu corretamente a {this.state.answerCounter} de {this.state.questionCounter} questões!</Paragraph>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => this.exitQuizz()}>Ok</Button>
                            </Dialog.Actions>
                        </Dialog>
                  </Portal>
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
