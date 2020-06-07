import React, { Component } from 'react';
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

    gotoHome(){ // falta tratamento do token
        history.push("/home");
    }

    usernameChange(event){
        this.setState({username: event.target.value});
    };

    passwordChange(event){
        this.setState({password: event.target.value});
    }

    gotoApp(){
        history.push("/");
    }

    async login(username, password){ 
        await fetch('https://trailobyte-275015.ew.r.appspot.com/rest/login/v1', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })

        .then(function(response){
            if(response.ok){
                return response.json();
            }
        })
        .then(function(data){
            console.log(data);
            var key = data;
            console.log(data);
            console.log(key);
            localStorage.removeItem("key");
            localStorage.removeItem("username");
            if(key != null){
                localStorage.setItem("key",key);
                localStorage.setItem("username",username);
            }
        })
        this.gotoHome();
        
        }

    render(){
        return(
            <div className="login">
                <button onClick={this.gotoApp}>Back</button>
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