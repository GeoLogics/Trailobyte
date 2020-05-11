import React from "react";
import './App.css';
import { withRouter } from "react-router-dom";
import history from '../../history';

class App extends React.Component {

    gotoLogin() {
        history.push("/login");
    }

    gotoRegister() {
        history.push("/register");
    }

    render() {
        return (
            <div id="app">
                <div className="app">
                        <div className="imgLogo">
                            <a href="/">
                                <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#ffffff" d="M28 52.7C14.5 52.7 3.4 41.5 3.4 28c0-2.8.5-5.5 1.4-8.1l14.4 28c.2.4.4.7.9.7s.7-.3.9-.7L27.7 33c.1-.2.2-.3.3-.3.2 0 .2.2.3.3l6.8 14.9c.2.4.4.7.9.7s.7-.3.9-.7l14.4-28c.9 2.5 1.4 5.2 1.4 8.1-.1 13.5-11.2 24.7-24.7 24.7zm0-31.1c-.2 0-.2-.2-.3-.3L20 4.7c2.5-.9 5.2-1.4 8-1.4s5.5.5 8 1.4l-7.7 16.6c-.1.1-.1.3-.3.3zm-8.1 18c-.2 0-.2-.2-.3-.3L7 15.1c2.2-3.6 5.4-6.6 9.1-8.7L25 25.6c.2.4.4.5.7.5h4.6c.3 0 .5-.1.7-.5l8.8-19.2c3.7 2.1 6.9 5.1 9.1 8.7L36.4 39.3c-.1.2-.2.3-.3.3-.2 0-.2-.2-.3-.3L31 28.7c-.2-.4-.4-.5-.7-.5h-4.6c-.3 0-.5.1-.7.5l-4.8 10.6c-.1.1-.1.3-.3.3zM28 56c15.5 0 28-12.5 28-28S43.5 0 28 0 0 12.5 0 28s12.5 28 28 28z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="buttoms">
                        <button onClick={() => this.gotoRegister()} className="btn">Registo</button>
                        <button onClick={() => this.gotoLogin()} className="btn">Login</button>
                    </div>

                </div>
        );
    }
}

export default withRouter(App);