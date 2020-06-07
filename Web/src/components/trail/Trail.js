import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import history from '../../history';
import { render } from 'react-dom';
import './Trail.css';


class Trail extends Component {



    gotoAppViewTrail(){
        history.push("/view/SintraCascais");
    }

    gotoAppPostTrail(){
        history.push("/postTrail");
    }


    render(){
        return(
            <div className="trail">
                <div className="bar">
                    <ul>
                        <li><a href="home">Home</a></li>
                        <li><a href="trail">Trail</a></li>
                        <li><a href="askquizz">Quizz</a></li>
                        <li style={{float: 'right'}}><a href="../logout">Logout</a></li>
                    </ul>
                </div>
                <form>
                    <h2>Trail</h2>
                    <div className="submitTrail">
                        
                        <input type="submit" onClick ={this.gotoAppViewTrail} value = "View Trails"/> 

                        <p>

                        </p>             
                        
                        <input type="submit" onClick ={this.gotoAppPostTrail} value = "Post Trail"/>              
                       
                    </div>
                </form>
            </div>
        );
    }
}

    export default withRouter(Trail);