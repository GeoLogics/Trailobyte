import React,{ Component } from "react";
import history from '../../history';
import './QuizzQTF.css';

var body = document.body,
  html = document.documentElement;

var height = Math.max(body.scrollHeight, body.offsetHeight,
  html.clientHeight, html.scrollHeight, html.offsetHeight);

export default class QuizzQTF extends Component{

    constructor(props){
        super(props);
        this.state = {
            answersList: [],
            answer1:'',
            answer2:'',
            answer3:'',
            answer4:'',
            error:'',
            question: props.question,
            number: props.nr,
        };

        this.submit = this.submit.bind(this);
        this.gotoApp = this.gotoApp.bind(this);
        this.answersListChange = this.answersListChange.bind(this);
        this.DefaultError = this.DefaultError.bind(this);
    }

    DefaultError() {
        this.setState({ error: '' });
    }

    submit(event){
        event.preventDefault();

        if(!this.state.answersList){
            return this.setState({error: 'answersList invalido'});
        }

        
        return this.setState({ error: '' });
    }

    gotoApp(){ // falta tratamento do token
        history.push("/home");
    }


    answersListChange(event){
        this.setState({answersList: event.target.value});
    };


    answerJoin(){
        var array=[this.state.answer1, this.state.answer2, this.state.answer3, this.state.answer4];
        this.state.answersList = array;
    };

    getAnwser1(){
        var radios = document.getElementsByName("radAnswer1");
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                this.state.answer1=radios[i].value;
            }
        } 
    };

    getAnwser2(){
        var radios = document.getElementsByName("radAnswer2");
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                this.state.answer2=radios[i].value;
            }
        }
    };

    getAnwser3(){
        var radios = document.getElementsByName("radAnswer3");
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                this.state.answer3=radios[i].value;
            }
        }
    };

    getAnwser4(){
        var radios = document.getElementsByName("radAnswer4");
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                this.state.answer4=radios[i].value;
            }
        }
    };

    enuncitedShow(){
        return this.state.question.enunciated;
    }

    questionShow(x){
        return this.state.question.questionsList.questions[x];
    }

    questionXShow(){
        return this.state.question.question;
    }

    activate = () => {
        document.getElementById('getAnswer').click();
    }

    disable = () => {
        document.getElementById('getAnswer').disabled = 'disabled';
    }

    getAnwser = () => {
        this.getAnwser1();
        this.getAnwser2();
        this.getAnwser3();
        this.getAnwser4();
        this.answerJoin();
        var temp = [this.state.number,this.state.answersList];
        this.props.parentCallback(temp);
        this.disable();
        window.scrollBy(0,height+60);
    };

    render(){
        return(
            <div className="QuizzQTF">

            <div className="enunciatedTF">
                <a id = "AQuizzE">Enuncited</a>
                <textarea name="myTextBox" cols="131" rows="5" value = {this.enuncitedShow()} readOnly>
                </textarea>     
            </div>

            <div className="question">
                <a id = "AQuizzQ">Question</a>
                <input id="textIDQ1" type="text" value = {this.questionXShow()} readOnly/>
            </div>

            <div className="question1">
                <input id="radioT" type="radio" value="T" name="radAnswer1" /><a id = "T">T</a>
                <input type="radio" value="F" name="radAnswer1" /><a id = "F">F</a>
                <input type="text"  value = {this.questionShow(0)} readOnly/>
            </div>

            <div className="question2">
                <input id="radioT" type="radio" value="T" name="radAnswer2" /><a id = "T">T</a>
                <input type="radio" value="F" name="radAnswer2" /><a id = "F">F</a>
                <input type="text"  value = {this.questionShow(1)} readOnly/>
            </div>

            <div className="question3">
                <input id="radioT" type="radio" value="T" name="radAnswer3" /><a id = "T">T</a>
                <input type="radio" value="F" name="radAnswer3" /><a id = "F">F</a>
                <input type="text"  value = {this.questionShow(2)} readOnly/>
            </div>

            <div className="question4">
                <input id="radioT" type="radio"  name="radAnswer4" value= 'T' /><a id = "T">T</a>
                <input type="radio"  name="radAnswer4" value= 'F' /><a id = "F">F</a>
                <input type="text"   value = {this.questionShow(3)} readOnly/>
            </div>
            <div className="QTFsubmit">
                <input type="submit" onClick ={this.getAnwser} value = "Next" id="getAnswer"/>
            </div>
        </div>
        );
    }

}