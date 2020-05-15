import React,{ Component } from "react";
import { withRouter } from "react-router-dom";
import history from '../../history';

import './QTFPost.css';

class QTFPost extends Component{

    constructor(){
        super();
        this.state = {
            enunciated: '',
            question1:'',
            question2:'',
            question3:'',
            question4:'',
            answer1:'',
            answer2:'',
            answer3:'',
            answer4:'',
            error:'',
            returnOfServer:''
        };

        this.submit = this.submit.bind(this);
        this.gotoApp = this.gotoApp.bind(this);
        this.enunciatedChange = this.enunciatedChange.bind(this);
        this.question1Change = this.question1Change.bind(this);
        this.question2Change = this.question2Change.bind(this);
        this.question3Change = this.question3Change.bind(this);
        this.question4Change = this.question4Change.bind(this);
        this.DefaultError = this.DefaultError.bind(this);
    }

    DefaultError() {
        this.setState({ error: '' });
    }

    submit(event){
        event.preventDefault();

        if(!this.state.enunciated){
            return this.setState({error: 'Eunciated invalido'});
        }

        if(!this.state.question1){
            return this.setState({error: 'question1 invalido'});
        }
        
        if(!this.state.question2){
            return this.setState({error: 'question2 invalido'});
        }
        
        if(!this.state.question3){
            return this.setState({error: 'question3 invalido'});
        }
        
        if(!this.state.question4){
            return this.setState({error: 'question4 invalido'});
        }
        
        return this.setState({ error: '' });
    }

    gotoApp(){ // falta tratamento do token
        history.push("/askquizz");
    }

    enunciatedChange(event){
        this.setState({enunciated: event.target.value});
    };

    question1Change(event){
        this.setState({question1: event.target.value});
    };

    question2Change(event){
        this.setState({question2: event.target.value});
    };

    question3Change(event){
        this.setState({question3: event.target.value});
    };

    question4Change(event){
        this.setState({question4: event.target.value});
    };




    questionJoin(question1, question2, question3, question4){
        var questionsList={questions:[question1, question2, question3, question4]};

        return questionsList;
    };




    answerJoin(answer1, answer2, answer3, answer4){
        var answersList={answersList:[answer1, answer2, answer3, answer4]};

        return answersList;
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



    async postQTF(enunciated, questionsList, answersList){ 
        const username = localStorage.getItem("username");
        const key = localStorage.getItem("key");
        await fetch('https://trailobyte-275015.ew.r.appspot.com/rest/question/postQTF', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'username': username,
                'Authorization': 'Bearer ' + key,
            },
            body: JSON.stringify({
                enunciated: enunciated,
                question: "Question: Escolha Verdadeiro ou Falso para cada frase",
                questionsList: questionsList,
                answersList: answersList,
                id: 1,
                numberOfQuestions: 4

            })
        })
        .then(function(response){
            if(response.ok)
                return;
            else
                return; 
            })
        this.gotoApp();
        
    }

    postQTFAll(){
        var questionsList = this.questionJoin(this.state.question1, this.state.question2, this.state.question3, this.state.question4);
        this.getAnwser1();
        this.getAnwser2();
        this.getAnwser3();
        this.getAnwser4();
        var answersList = this.answerJoin(this.state.answer1, this.state.answer2, this.state.answer3, this.state.answer4);
        this.postQTF(this.state.enunciated, questionsList, answersList);
    }



    render(){
        return(
            <div className="QTFPost">
            <button onClick={this.gotoApp}>Back</button>
            <form onSubmit={this.submit}>
                {
                    this.state.error &&
                    <h3 data-test="error" onClick={this.dismissError}>
                        <button onClick={this.dismissError}>✖</button>
                        {this.state.error}
                    </h3>
                }
            <h2>Question of True and False</h2>

            <div className="enunciatedTF1">
                <textarea name="myTextBox" cols="131" rows="5" placeholder="Enunciated" value = {this.state.enunciated} onChange={this.enunciatedChange}>
                    
                </textarea>     
            </div>

            <div className="question1">
                <input id = "radioPostQTF" type="radio" value="T" name="radAnswer1" /><a id = "T">T</a>
                <input type="radio" value="F" name="radAnswer1" /><a id = "F">F</a>
                <input type="text" placeholder="Question1" data-test="question1" value = {this.state.question1} onChange={this.question1Change}/>
            </div>

            <div className="question2">
                <input id = "radioPostQTF" type="radio" value="T" name="radAnswer2" /><a id = "T">T</a>
                <input type="radio" value="F" name="radAnswer2" /><a id = "F">F</a>
                <input type="text" placeholder="Question2" data-test="question2" value = {this.state.question2} onChange={this.question2Change}/>
            </div>

            <div className="question3">
                <input id = "radioPostQTF" type="radio" value="T" name="radAnswer3" /><a id = "T">T</a>
                <input type="radio" value="F" name="radAnswer3" /><a id = "F">F</a>
                <input type="text" placeholder="Question3" data-test="question3" value = {this.state.question3} onChange={this.question3Change}/>
            </div>

            <div className="question4">
                <input id = "radioPostQTF" type="radio"  name="radAnswer4" value= 'T' /><a id = "T">T</a>
                <input type="radio"  name="radAnswer4" value= 'F' /><a id = "F">F</a>
                <input type="text" placeholder="Question4" data-test="question4" value = {this.state.question4} onChange={this.question4Change}/>
            </div>

            <div className="submitQuestion">
                <input type="submit" onClick ={()=> {this.postQTFAll()}} value = "Post" data-test = "submit"/>
                
            </div>
            </form>
        </div>
        );
    }

}

export default withRouter(QTFPost);