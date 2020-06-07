import React,{ Component } from "react";
import { withRouter } from "react-router-dom";
import history from '../../history';
import "./quizzPost.css"


class QuizzPost extends Component{


    gotoAppQMC(){ 
        history.push("/quizz/createQMC");
    }

    gotoAppQO(){
        history.push("/quizz/createQO");
    }

    gotoAppQTF(){ 
        history.push("/quizz/createQTF");
    }

    render(){
        return(
            <div className="quizzPost">

                <div className="bar">
                    <ul>
                        <li><a href="../home">Home</a></li>
                        <li><a href="../trail">Trail</a></li>
                        <li><a href="../askquizz">Quizz</a></li>
                        <li style={{float: 'right'}}><a href="../logout">Logout</a></li>
                    </ul>
                </div>
                <h2>Choose type of Question</h2>
                <div className="submitQuizzPost">
                    <input type="submit" onClick ={this.gotoAppQMC} value = "Post Question of Multiple Choice" data-test = "submit"/>
                    <p>

                    </p>
                    <input type="submit" onClick ={this.gotoAppQO} value = "Post Question of Ordering" data-test = "submit"/>
                    <p>
                        
                    </p>
                    <input type="submit" onClick ={this.gotoAppQTF} value = "Post Question or True and False" data-test = "submit"/>                
                </div>
            </div>
        );
    }
}
export default withRouter(QuizzPost);