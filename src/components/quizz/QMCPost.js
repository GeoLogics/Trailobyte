import React,{ Component } from "react";
import { withRouter } from "react-router-dom";
import history from '../../history';

import '../app/App.css';
import './QMCPost.css';


class QMCPost extends Component{


    constructor(){
        super();
        this.state = {
            enunciated: '',
            question: '',
            optionA: '',
            optionB: '',
            optionC: '',
            optionD: '',
            correctOption: '',
            error:'',
            returnOfServer:''
        };

        this.submit = this.submit.bind(this);
        this.gotoApp = this.gotoApp.bind(this);
        this.enunciatedChange = this.enunciatedChange.bind(this);
        this.questionChange = this.questionChange.bind(this);
        this.optionAChange = this.optionAChange.bind(this);
        this.optionBChange = this.optionBChange.bind(this);
        this.optionCChange = this.optionCChange.bind(this);
        this.optionDChange = this.optionDChange.bind(this);
        this.correctOptionChange = this.correctOptionChange.bind(this);
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

        if(!this.state.question){
            return this.setState({error: 'Question invalido'});
        }

        if(!this.state.optionA){
            return this.setState({error: 'optionA invalido'});
        }

        if(!this.state.optionB){
            return this.setState({error: 'optionB invalido'});
        }

        if(!this.state.optionC){
            return this.setState({error: 'optionC invalido'});
        }

        if(!this.state.optionD){
            return this.setState({error: 'optionD invalido'});
        }

        if(!this.state.correctOption){
            return this.setState({error: 'correctOption invalido'});
        }
        
        return this.setState({ error: '' });
    }

    gotoApp(){ // falta tratamento do token
        history.push("/askquizz");
    }

    enunciatedChange(event){
        this.setState({enunciated: event.target.value});
    };

    questionChange(event){
        this.setState({question: event.target.value});
    };

    optionAChange(event){
        this.setState({optionA: event.target.value});
    };

    optionBChange(event){
        this.setState({optionB: event.target.value});
    };

    optionCChange(event){
        this.setState({optionC: event.target.value});
    };

    optionDChange(event){
        this.setState({optionD: event.target.value});
    };

    correctOptionChange(event){
        this.setState({correctOption: event.target.value});
    };

    getAnwser(){
        var radios = document.getElementsByName("radAnswer1");
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                this.state.correctOption=radios[i].value;
            }
        }
    };



    async postQMC(){ 
        const username = localStorage.getItem("username");
        const key = localStorage.getItem("key");
        this.getAnwser();
        await fetch('https://trailobyte-275015.ew.r.appspot.com/rest/question/postQMC', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'username': username,
                'Authorization': 'Bearer '+key,
            },
            body: JSON.stringify({
                enunciated: this.state.enunciated,
                question: this.state.question,
                optionA: this.state.optionA,
                optionB: this.state.optionB,
                optionC: this.state.optionC,
                optionD: this.state.optionD,
                correctOption: this.state.correctOption,
                id: 1,
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

    render(){
        return(
            <div className="QMCPost">
            <button onClick={this.gotoApp}>Back</button>
            <form onSubmit={this.submit}>
                {
                    this.state.error &&
                    <h3 data-test="error" onClick={this.dismissError}>
                        <button onClick={this.dismissError}>✖</button>
                        {this.state.error}
                    </h3>
                }
            <h2>Question of Multiple Choice</h2>

            <div className="enunciatedPostQMC">
                <textarea name="myTextBox" cols="131" rows="5" placeholder="Enunciated" value = {this.state.enunciated} onChange={this.enunciatedChange}>
                    
                </textarea>     
            </div>

            <div className="question">
                <input id = "postqmcQ" type="text" placeholder="Question" data-test="question" value = {this.state.question} onChange={this.questionChange}/>
            </div>

            <div className="optionA">
                <input id ="radio" type="radio" value="A" name="radAnswer1" /><a id = "opt">OptionA</a>
                <input type="text" placeholder="OptionA" data-test="optionA" value = {this.state.optionA} onChange={this.optionAChange}/>
            </div>

            <div className="optionB">
                <input id ="radio" type="radio" value="B" name="radAnswer1" /><a id = "opt">OptionB</a>
                <input type="text" placeholder="OptionB" data-test="optionB" value = {this.state.optionB} onChange={this.optionBChange}/>
            </div>

            <div className="optionC">
                <input id ="radio" type="radio" value="C" name="radAnswer1" /><a id = "opt">OptionC</a>
                <input type="text" placeholder="OptionC" data-test="optionC" value = {this.state.optionC} onChange={this.optionCChange}/>
            </div>

            <div className="optionD">
                <input id ="radio" type="radio" value="D" name="radAnswer1" /><a id = "opt">OptionD</a>
                <input type="text" placeholder="OptionD" data-test="optionD" value = {this.state.optionD} onChange={this.optionDChange}/>
            </div>

            <div className="submitQuestionPostQMC">
                <input type="submit" onClick ={()=> {this.postQMC()}} value = "Post" data-test = "submit"/>
           
            </div>
            </form>
        </div>
        );
    }

}

export default withRouter(QMCPost);