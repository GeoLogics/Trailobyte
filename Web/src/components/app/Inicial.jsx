import React from "react";
import './App.css';
import { withRouter } from "react-router-dom";
import history from '../../history';

class Inicial extends React.Component {

    gotoLogin() {
        history.push("/login");
    }

    gotoRegister() {
        history.push("/register");
    }

    render() {
       return (
            <div className="app">
                <header className="headerapp">
                    <div className="headerapp-text">
                    <a>Venha conhecer os nossos caminhos</a>
                    </div>
                </header>
                <div className="barapp">
                    <ul className="app">
                        <li ><a  href="/">Home</a></li>
                        <li><a href="login">Trail</a></li>
                        <li className = "applogin" style={{float: 'right'}}><a  href="login">Login</a></li>
                        <li className = "applogin" style={{float: 'right'}}><a  href="register">Sign up</a></li>
                        <li ><a  href="login">Quizz</a></li>
                    </ul>
                </div>
                <div className="contentapp">

                </div>
            </div>
        );
    }
}

export default withRouter(Inicial);