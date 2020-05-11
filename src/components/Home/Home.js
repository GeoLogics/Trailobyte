import React from "react";
import './Home.css';
import { withRouter } from "react-router-dom";



class Home extends React.Component {

    render() {
        return (
            <div className="home">
                <header className="headerhome">
                    <div className="header-text">
                    <a>Venha conhecer os nossos caminhos</a>
                    </div>
                </header>
                <div className="bar">
                    <ul>
                        <li><a href="Home">Home</a></li>
                        <li><a href="Login">Login</a></li>
                        <li><a href="askquizz">Quizz</a></li>
                    </ul>
                </div>
                <div className="content">

                </div>
            </div>
        );
    }
}

export default withRouter(Home);