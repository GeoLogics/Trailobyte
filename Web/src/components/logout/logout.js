import React,{ Component } from "react";
import { withRouter } from "react-router-dom";
import "./logout.css";
import history from '../../history';

class logout extends Component{

    constructor(){
        super();
        this.logout();
    }

    gotoApp(){
        history.push("/");
    }

    async logout(){
        var username = localStorage.getItem("username");
        var key = localStorage.getItem("key");
        console.log(username);
        console.log(key);
        await fetch('https://trailobyte-275015.ew.r.appspot.com/rest/logout/v1', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'username': username,
                'Authorization': 'Bearer '+ key,
            }
        })
        .then(function(response){if(response.ok){
            localStorage.removeItem("key");
            localStorage.removeItem("username");
        }
    else{
        return;
        }
    });        
        this.gotoApp();
        
    }

    render(){
        return(
            <div className="logout">
                <button onClick={this.gotoApp}>Back</button>
                <h2>Logout</h2>
                <p>Volte sempre!</p>
            </div>
        );

    }
}

export default withRouter(logout);