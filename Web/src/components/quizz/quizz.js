import React, { Component } from 'react';
import '../app/App.css';
import { withRouter } from "react-router-dom";
import history from '../../history';
import { render } from 'react-dom';

import './quizz.css';


class Quizz extends Component {



    gotoAppStartQuizz(){
        history.push("/quizz/start");
    }

    gotoAppPostQuizz(){
        history.push("/quizz/create");
    }


    render(){
        return(
            <div className="quizz">
                <div className="bar">
                    <ul>
                        <li><a href="home">Home</a></li>
                        <li><a href="trail">Trail</a></li>
                        <li><a href="askquizz">Quizz</a></li>
                        <li style={{float: 'right'}}><a href="../logout">Logout</a></li>
                    </ul>
                </div>
                <form>
                    <h2>Quizz</h2>
                    <div className="submitQuizz">
                        
                        <input type="submit" onClick ={this.gotoAppStartQuizz} value = "Start Quizz" data-test = "submit"/> 

                        <p>

                        </p>             
                        
                        <input type="submit" onClick ={this.gotoAppPostQuizz} value = "Post Quizz" data-test = "submit"/>              
                       
                    </div>
                </form>
            </div>
        );
    }
}

    export default withRouter(Quizz);