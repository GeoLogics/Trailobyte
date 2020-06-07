import React,{ Component } from "react";
import './QuizzQMC.css';

var body = document.body,
                html = document.documentElement;
              
var height = Math.max(body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight);

            /*var quizzesQMC = null; 

            function randomNumber(min,max){
                let step1 = max - min + 1;
                let step2 = Math.random() * step1;
                let result = Math.floor(step2) + min;
                return result;
            }
            
            function arrayRandomNumber(start, end){
                let array = [];
            
                for(let i = start; i >= end; i++){
                    array.push(i);
                }
            
                return array;
            }
            
            var arrayID = arrayRandomNumber(1,23);
*/
export default class QuizzQMC extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            question: props.question,
            number: props.nr,
        };
    }

    enuncitedShow(){
        return this.state.question.enunciated;
    }

    questionShow(){
        return this.state.question.question;
    }

    optionAShow(){
        return this.state.question.optionA;
    }

    optionBShow(){
        return this.state.question.optionB;
    }

    optionCShow(){
        return this.state.question.optionC;
    }

    optionDShow(){
        return this.state.question.optionD;
    }

    activate = () => {
        document.getElementById('getAnswer').click();
    }

    disable = () => {
        document.getElementById('getAnswer').disabled = 'disabled';
    }

    getAnwser = () => {
        var radios = document.getElementsByName("radAnswer1");
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                var temp = [this.state.number,radios[i].value];
                this.props.parentCallback(temp);
            }
        }
        this.disable();
        window.scrollBy(0,height+60);
    };


    render(){
        return(
            <div className="QuizzQMC">
            <a id = "AQuizzE">Enuncited</a>
            <div className="enunciatedDoQMC">
                <textarea name="myTextBox" cols="131" rows="5" value = {this.enuncitedShow()} readOnly>
                </textarea>     
            </div>

            <div className="question">
                <a id = "AQuizzQ">Question</a>
                <input id = "textIDQ1" type="text" value = {this.questionShow()} readOnly/>
            </div>

            <div className="optionA">
                <input id ="radio" type="radio" value="A" name= {this.state.number} /><a id = "opt">OptionA</a>
                <input id = "textIDQ" type="text" value = {this.optionAShow()} readOnly/>
            </div>

            <div className="optionB">
                <input id ="radio" type="radio" value="B" name={this.state.number} /><a id = "opt">OptionB</a>
                <input id = "textIDQ" type="text" value = {this.optionBShow()} readOnly/>
            </div>

            <div className="optionC">
                <input id ="radio" type="radio" value="C" name={this.state.number} /><a id = "opt">OptionC</a>
                <input id = "textIDQ" type="text" value = {this.optionCShow()} readOnly/>
            </div>

            <div className="optionD">
                <input id ="radio" type="radio" value="D" name={this.state.number} /><a id = "opt">OptionD</a>
                <input id = "textIDQ" type="text" value = {this.optionDShow()} readOnly/>
            </div>
            <div className="QMCsubmit">
                <input type="submit" onClick ={this.getAnwser} value = "Next" id="getAnswer"/>
            </div>
        </div>
        );
    }
}
