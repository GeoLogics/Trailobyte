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
                    <ul className="home">
                        <li className="home"><a className="home" href="home">Home</a></li>
                        <li className="home"><a className="home" href="askquizz">Quizz</a></li>
                        <li className="home"><a className="home" href="trail">Trail</a></li>
                        <li className="home" style={{float: 'right'}}><a className="home" href="logout">Logout</a></li>
                    </ul>
                </div>
                <div className="content">

                </div>
            </div>
        );
    }
}

export default withRouter(Home);