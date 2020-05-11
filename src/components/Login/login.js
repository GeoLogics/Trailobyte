import React, { Component } from 'react';
import '../app/App.css';
import './login.css';
import { withRouter } from "react-router-dom";
import history from '../../history';
import { render } from 'react-dom';

class login extends Component {
    constructor(){
        super();
        this.state = {
            username: '',
            password: '',
            error:'',
            token:''
        };

        this.submit = this.submit.bind(this);
        this.gotoApp = this.gotoApp.bind(this);
        this.usernameChange = this.usernameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.DefaultError = this.DefaultError.bind(this);
    }


    DefaultError() {
        this.setState({ error: '' });
    }



    submit(event){
        event.preventDefault();

        if(!this.state.username){
            return this.setState({error: 'Username invalido'});
        }

        if(!this.state.password){
            return this.setState({error: 'Password invalido'});
        }
        
        return this.setState({ error: '' });
    }

    gotoApp(){ // falta tratamento do token
        history.push("/home");
    }

    usernameChange(event){
        this.setState({username: event.target.value});
    };

    passwordChange(event){
        this.setState({password: event.target.value});
    }

    async login(username, password){ 
        await fetch('http://localhost:8080/rest/login/v1', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(function(response){ console.log(response)  ;return response.json(); })
        .then(function(data) {
            console.log( data)
            const token = data.token;
            console.log(token)
            localStorage.removeItem("token");
            if(token != null){
                localStorage.setItem("token",token);
            }
        })
        this.gotoApp();
        
        }

    render(){
        return(
            <div className="login">
                <form onSubmit={this.submit}>
                    {
                        this.state.error &&
                        <h3 data-test="error" onClick={this.DefaultError}>
                            <button onClick={this.DefaultError}>✖</button>
                            {this.state.error}
                        </h3>
                    }
                <h2>Login</h2>
                <div className="user">
                    <input type="text" placeholder="Username" data-test="username" value = {this.state.username} onChange={this.usernameChange}/>
                </div>
                <div className="pass">
                    <input type="password" placeholder="Password" data-test="password" value = {this.state.password} onChange={this.passwordChange}/>
                </div>
                <div className="submitlogin">
                    <input type="submit" onClick ={()=> {this.login(this.state.username,this.state.password)}} value = "Login" data-test = "submit"/>
                    <p >No account? <a href="register">Click here</a></p>                
                </div>
                </form>
            </div>
        );
    }
}

    export default withRouter(login);