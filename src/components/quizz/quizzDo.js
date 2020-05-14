import React,{ Component } from "react";
import { withRouter } from "react-router-dom";
import history from '../../history';

import './quizzDo.css';
import QuizzQMC from "./QuizzQMC";
import QuizzQO from "./QuizzQO";
import QuizzQTF from "./QuizzQTF";
//import Loader from 'react-loader-spinner';

class quizzDo extends Component{
    constructor(props){
        super(props);
        this.state={
            questionQMC: [],
            questionQO: [],
            questionQTF: [],
            answerQMC:[],
            answerQO: [],
            answerQTF: [],
            result: '',
        }
    }

    DefaultError() {
        this.setState({ error: '' });
    }


    validateQOs(i){
        var bol1= false;
        var bol2= false;
        var bol3= false;
        var bol4= false;
        var bol5= false;

        if(this.state.questionQO[i].byOrder[0] == this.state.answerQO[i][0])
            bol1=true;

        if(this.state.questionQO[i].byOrder[1] == this.state.answerQO[i][1])
            bol2=true;

        if(this.state.questionQO[i].byOrder[2] == this.state.answerQO[i][2])
            bol3=true;

        if(this.state.questionQO[i].byOrder[3] == this.state.answerQO[i][3])
            bol4=true;

        if(this.state.questionQO[i].byOrder[4] == this.state.answerQO[i][4])
            bol5=true;

        return bol1 && bol2 && bol3 && bol4 && bol5;
    }

    validateQTFs(i){
        var q1=false;
        var q2=false;
        var q3=false;
        var q4=false;

        if(this.state.questionQTF[i].answersList[0] == this.state.answerQTF[i][0])
            q1=true;

        if(this.state.questionQTF[i].answersList[1] == this.state.answerQTF[i][1])
            q2=true;

        if(this.state.questionQTF[i].answersList[2] == this.state.answerQTF[i][2])
            q3=true;

        if(this.state.questionQTF[i].answersList[3] == this.state.answerQTF[i][3])
            q4=true;

        return q1 && q2 && q3 && q4;
    }

    validateQMC(i){
        if(this.state.questionQMC[i].correctOption == this.state.answerQMC[i])
            return true;
        return false;
    }

    gotoApp(){
        history.goBack();
    }

    componentWillMount(){
        this.askquizzQMC(1);
        this.askquizzQO(1);
        this.askquizzQTF(1);
    }

     askquizzQMC(i)
     {
         fetch('https://trailobyte-275015.ew.r.appspot.com/rest/question/getQMC/'+ i, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        })
        .then(async (response) => {
            var temp = await response.json();
            this.setState({questionQMC: [...this.state.questionQMC,temp],
                answerQMC: [...this.state.answerQMC,temp.correctOption],
            });
        })
        .catch(error => alert("Server not available"));
    }

    askquizzQO(i){
         fetch('https://trailobyte-275015.ew.r.appspot.com/rest/question/getQO/'+ i, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        })
        .then(async (response) => {
            var temp = await response.json();
            this.setState({questionQO: [...this.state.questionQO,temp],
                answerQO: [...this.state.answerQO,temp.byOrder.byOrder],
            });
        })
        .catch(error => alert("Server not available"));

    }



     askquizzQTF(i){
         fetch('https://trailobyte-275015.ew.r.appspot.com/rest/question/getQTF/'+ i, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        })
        .then(async (response) => {
            var temp = await response.json();
            this.setState({questionQTF: [...this.state.questionQTF,temp],
                answerQTF: [...this.state.answerQTF,temp.answersList],
            });
        })
        .catch(error => alert("Server not available"));
    }

    callBackAnswersQMC = answerFromQuestion => {
        var array = this.state.answerQMC;
        array[answerFromQuestion[0]-1] = answerFromQuestion[1];
        this.setState({answerQMC: array});
    }

    callBackAnswersQO = answerFromQuestion => {
        var array = this.state.answerQO;
        array[answerFromQuestion[0]-1] = answerFromQuestion[1];
        this.setState({answerQO: array});
    }

    callBackAnswersQTF = answerFromQuestion => {
        var array = this.state.answerQTF;
        array[answerFromQuestion[0]-1] = answerFromQuestion[1];
        this.setState({answerQTF: array});
    }

    callbacktest = () => {
        var result = 0;
        this.refs.Question0.activate();
        this.refs.Question1.activate();
        this.refs.Question2.activate();

        if(this.validateQMC(0))
                result++;
        if(this.validateQOs(0))
            result++;
        if(this.validateQTFs(0))
            result++;
        alert(result + "/" + 3);
    }


    render(){
        return(
            <div className="quizzDo">
                <button onClick={this.gotoApp}>Back</button>
                <h1>Quizz</h1>
                <div className="allQuestions">
                    {this.state.questionQMC.map((question,idx) => {
                        return(
                            <div key={"QMC_" + idx}>
                                <h2>Pergunta {idx}</h2>
                                <QuizzQMC question = {question} nr={idx} parentCallback = {this.callBackAnswersQMC} ref ={`Question${idx}`}></QuizzQMC>
                            </div>
                        );
                    })}
                    {this.state.questionQO.map((question,idx) => {
                        return(
                            <div key={"QO_" + idx}>
                                <h2>Pergunta {idx+1}</h2>
                                <QuizzQO question = {question} nr={idx} parentCallback = {this.callBackAnswersQO} ref ={`Question${idx+1}`} ></QuizzQO>
                            </div>
                        );
                    })}
                    {this.state.questionQTF.map((question,idx) => {
                        return(
                            <div key={"QTF_" + idx}>
                                <h2>Pergunta {idx+2}</h2>
                                <QuizzQTF question = {question} nr={idx} parentCallback = {this.callBackAnswersQTF} ref ={`Question${idx+2}`}></QuizzQTF>
                            </div>
                        );
                    })}

                   <input type="submit" onClick ={this.callbacktest} value = "Submit"/>         
                </div>
            
            </div>
        );
    }
}
export default withRouter(quizzDo);