import React,{ Component } from "react";
import '../app/App.css';
import './QuizzQO.css';

var optionsByOrder= [];

var body = document.body,
  html = document.documentElement;

var height = Math.max(body.scrollHeight, body.offsetHeight,
  html.clientHeight, html.scrollHeight, html.offsetHeight);

export default class QuizzQO extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            option1Order:'',
            option2Order:'',
            option3Order:'',
            option4Order:'',
            option5Order:'',
            error:'',
            question: props.question,
            number: props.nr,
        };


        this.option1OrderChange = this.option1OrderChange.bind(this);
        this.option2OrderChange = this.option2OrderChange.bind(this);
        this.option3OrderChange = this.option3OrderChange.bind(this);
        this.option4OrderChange = this.option4OrderChange.bind(this);
        this.option5OrderChange = this.option5OrderChange.bind(this);
        this.DefaultError = this.DefaultError.bind(this);
    }

    

    DefaultError() {
        this.setState({ error: '' });
    }


    option1OrderChange(event){
        this.setState({option1Order: event.target.value});
    };

    option2OrderChange(event){
        this.setState({option2Order: event.target.value});
    };

    option3OrderChange(event){
        this.setState({option3Order: event.target.value});
    };

    option4OrderChange(event){
        this.setState({option4Order: event.target.value});
    };

    option5OrderChange(event){
        this.setState({option5Order: event.target.value});
    };

    enunciatedShow(){
        return this.state.question.enunciated;
    }

    optionShow(x){
        return this.state.question.options.options[x];
    }

    questionShow(){
        return this.state.question.question;
    }


    setOrder(option, optionOrder){
        optionsByOrder[optionOrder-1] = option
     }


    activate = () => {
        document.getElementById('getAnswer').click();
    }

    disable = () => {
        document.getElementById('getAnswer').disabled = 'disabled';
    }

    getAnwser = () => {
        this.setOrder("option1", this.state.option1Order);
        this.setOrder("option2", this.state.option2Order);
        this.setOrder("option3", this.state.option3Order);
        this.setOrder("option4", this.state.option4Order);
        this.setOrder("option5", this.state.option5Order);
        var temp = [this.state.number,optionsByOrder];
        this.props.parentCallback(temp);
        this.disable();
        window.scrollBy(0,height+60);
    };

    render(){
        return(
            <div className="QuizzQO">
                <div className="enunciatedQOQuizz">
                <a id = "AQuizzE">Enuncited</a>
                    <textarea name="myTextBox" cols="131" rows="5"  value = {this.enunciatedShow()} readOnly>
        
                    </textarea>     
                </div>

                <div className="question">
                <a id = "AQuizzQ">Question</a>
                    <input type="text" id="QOQuizz" value = {this.questionShow()} readOnly/>
                </div>

                <div className="option1">
                    <input type="number" placeholder="Order" id="orderOfPostQuizz" min="1" max="5" value = {this.state.option1Order} onChange={this.option1OrderChange}/>
                    <input type="text" value = {this.optionShow(0)} readOnly/>
                </div>

                <div className="option2">
                    <input type="number" placeholder="Order" id="orderOfPostQuizz" min="1" max="5" value = {this.state.option2Order} onChange={this.option2OrderChange}/>
                    <input type="text" value = {this.optionShow(1)} readOnly/>
                </div>

                <div className="option3">
                    <input type="number" placeholder="Order" id="orderOfPostQuizz" min="1" max="5" value = {this.state.option3Order} onChange={this.option3OrderChange}/>
                    <input type="text" value = {this.optionShow(2)} readOnly/>
                </div>

                <div className="option4">
                    <input type="number" placeholder="Order" id="orderOfPostQuizz" min="1" max="5" value = {this.state.option4Order} onChange={this.option4OrderChange}/>
                    <input type="text" value = {this.optionShow(3)} readOnly/>
                </div>

                <div className="option5">
                    <input type="number" placeholder="Order" id="orderOfPostQuizz" min="1" max="5" value = {this.state.option5Order} onChange={this.option5OrderChange}/>
                    <input type="text" value = {this.optionShow(4)} readOnly/>
                </div>
                <div className="QOsubmit">
                     <input type="submit" onClick ={this.getAnwser} value = "Next" id="getAnswer"/>
                </div>
        </div>
        );
    }
}