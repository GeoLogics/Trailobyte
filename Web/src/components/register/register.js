import React, { Component } from 'react';
import './register.css';
import { withRouter } from "react-router-dom";
import { render } from 'react-dom';
import history from '../../history';

class register extends Component{
    constructor(){
        super();
        this.state = {
            username: '',
            password:'',
            confirmation:'',
            email: '',
            mobphone: '',
            address: '',
            error: '',
            success:'',
        };

        this.registo = this.registo.bind(this);
        this.gotoLoginAfter = this.gotoLoginAfter.bind(this);
        this.usernameChange = this.usernameChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.mobphoneChange = this.mobphoneChange.bind(this);
        this.DefaultError = this.DefaultError.bind(this);
        this.confirmationChange = this.confirmationChange.bind(this);
        this.emailChange = this.emailChange.bind(this);
        this.addressChange = this.addressChange.bind(this);
    }


        registo(event){
            
            event.preventDefault();

            if(!this.state.username){
                return this.setState({error: 'Username invalido'});
            }

            if(this.state.confirmation !== this.state.password){
                return this.setState({ error: 'Passwords are not identical' });
            }

            if(!this.state.password){
                return this.setState({error: 'Password invalido'});
            }
            if(!this.state.confirmation){
                return this.setState({error: 'Confirmacao invalida'});
            }
            if(!this.state.email){
                return this.setState({error: 'Email invalido'});
            }
            if(!this.state.mobphone){
                return this.setState({error: 'Telemovel invalido'});
            }
            if(!this.state.address){
                return this.setState({error: 'Morada invalida'});
            }

            
            return this.setState({ error: '' });
        }

        gotoApp(){
            history.push("/");
        }


        DefaultError() {
            this.setState({ error: '' });
        }

        DefaultSuccess() {
            this.setState({ success: '' });
        }

        gotoLoginAfter(){
            history.push("/login");
        }

        usernameChange(event){
            this.setState({username: event.target.value});
        };

        passwordChange(event){
            this.setState({password: event.target.value});
        };

        confirmationChange(event){
            this.setState({confirmation: event.target.value});
        };

        emailChange(event){
            this.setState({email: event.target.value});
        };
        mobphoneChange(event){
            this.setState({mobphone: event.target.value});
        };
        addressChange(event){
            this.setState({address: event.target.value});
        };


        async register(username,password,confirmation,email,mobphone,address){
            await fetch('https://trailobyte-275015.ew.r.appspot.com/rest/register/v1', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    confirmation: confirmation,
                    email: email,
                    telephone: '123',
                    mobilePhone: mobphone,
                    address: address,
                })
            })
                .then(function(response,data){ 
                    if(response.status == 204){
                        return;
                    }
                    else{
                        console.log(data);
                    }
                })
                console.log([this.state.username,this.state.password,this.state.confirmation,this.state.email,this.state.mobphone,this.state.address,this.state.role]);
            this.gotoApp();
        }

        render(){
            return(
                <div className="registo">
                    <button onClick={this.gotoApp}>Back</button>
                    <form onSubmit={this.registo}>
                  
                    <h1>Register your account</h1>
                    <div className="info1">
                        <input type="text" placeholder="Username" data-test="Username" value={this.state.username} onChange={this.usernameChange} />
                        <input type="text" placeholder="Email" data-test="Email" value={this.state.email} onChange={this.emailChange} />
                    </div>
                    <div className="info2">
                        <input type="password" id="p" placeholder="Password" data-test="password" value={this.state.password} onChange={this.passwordChange} />
                        <input type="text" placeholder="Mobile phone" data-test="mobile" value={this.state.mobphone} onChange={this.mobphoneChange} />  
                    </div>
                    <div className="info3">
                        <input type="password" placeholder="Confirm password" data-test="confirm password" value={this.state.confirmation} onChange={this.confirmationChange} /> 
                        <input type="text" placeholder="Address" data-test="address" value={this.state.address} onChange={this.addressChange} />
                    </div>
                        <div className="submit">   
                            <input type="submit" onClick ={()=> {this.register(this.state.username,this.state.password,this.state.confirmation,this.state.email,this.state.mobphone,this.state.address,this.state.role)}} value="Submit" data-test="submit" />
                            <p className="text">Already registered? <a href="login">Sign In</a></p>
                        </div>
                        
                        
                        

                    
                    {
                        this.state.error &&
                        <h3 data-test="error" onClick={this.DefaultError}>
                            {this.state.error}
                        </h3>
                    }
                    {
                        this.state.success &&
                        <h3 data-test="success" onClick={this.DefaultSuccess}>
                            {this.state.success}
                        </h3>
                    }
                    
                </form>
                    
                </div>
            );
        }
}


export default withRouter(register);