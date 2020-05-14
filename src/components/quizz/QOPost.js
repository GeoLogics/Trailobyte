import React,{ Component } from "react";
import { withRouter } from "react-router-dom";
import history from '../../history';

import '../app/App.css';
import './QOPost.css';

var optionsByOrder= [];

class QOPost extends Component{

    constructor(){
        super();
        this.state = {
            enunciated: '',
            question: '',
            options: [],
            option1:'',
            option2:'',
            option3:'',
            option4:'',
            option5:'',
            answersList: [],
            option1Order:'',
            option2Order:'',
            option3Order:'',
            option4Order:'',
            option5Order:'',
            error:'',
            returnOfServer:''
        };

        this.submit = this.submit.bind(this);
        this.gotoApp = this.gotoApp.bind(this);
        this.enunciatedChange = this.enunciatedChange.bind(this);
        this.questionChange = this.questionChange.bind(this);
        this.option1Change = this.option1Change.bind(this);
        this.option2Change = this.option2Change.bind(this);
        this.option3Change = this.option3Change.bind(this);
        this.option4Change = this.option4Change.bind(this);
        this.option5Change = this.option5Change.bind(this);
        this.answersListChange = this.answersListChange.bind(this);
        this.option1OrderChange = this.option1OrderChange.bind(this);
        this.option2OrderChange = this.option2OrderChange.bind(this);
        this.option3OrderChange = this.option3OrderChange.bind(this);
        this.option4OrderChange = this.option4OrderChange.bind(this);
        this.option5OrderChange = this.option5OrderChange.bind(this);
        this.DefaultError = this.DefaultError.bind(this);
    }

    DefaultError() {
        this.setState({ error: '' });
    }

    submit(event){
        event.preventDefault();

        if(!this.state.enunciated){
            return this.setState({error: 'Eunciated invalido'});
        }

        if(!this.state.question){
            return this.setState({error: 'Question invalido'});
        }

        if(!this.state.questionsList){
            return this.setState({error: 'questionsList invalido'});
        }

        if(!this.state.answersList){
            return this.setState({error: 'answersList invalido'});
        }
        
        return this.setState({ error: '' });
    }

    gotoApp(){ // falta tratamento do token
        history.push("/askquizz");
    }

    enunciatedChange(event){
        this.setState({enunciated: event.target.value});
    };

    questionChange(event){
        this.setState({question: event.target.value});
    };

    
    option1Change(event){
        this.setState({option1: event.target.value});
    };

    option2Change(event){
        this.setState({option2: event.target.value});
    };

    option3Change(event){
        this.setState({option3: event.target.value});
    };

    option4Change(event){
        this.setState({option4: event.target.value});
    };

    option5Change(event){
        this.setState({option5: event.target.value});
    };

    answersListChange(event){
        this.setState({answersList: event.target.value});
    };

    option1OrderChange(event){
        this.setState({option1Order: event.target.value});
    };

    option2OrderChange(event){
        this.setState({option2Order: event.target.value});
    };

    option3OrderChange(event){
        this.setState({option3Order: event.target.value});
    };

    option4OrderChange(event){
        this.setState({option4Order: event.target.value});
    };

    option5OrderChange(event){
        this.setState({option5Order: event.target.value});
    };



    optionJoin(option1, option2, option3, option4, option5){
        var options={options:[option1, option2, option3, option4, option5]};

        return options;
    };


    setOrder(option, optionOrder){

       optionsByOrder[optionOrder-1]=option
        
    }


    optionByOrderJoin(option1Order, option2Order, option3Order, option4Order, option5Order){

        this.setOrder("option1", option1Order);
        this.setOrder("option2", option2Order);
        this.setOrder("option3", option3Order);
        this.setOrder("option4", option4Order);
        this.setOrder("option5", option5Order);
        


        var byOrder={byOrder:[optionsByOrder[0], optionsByOrder[1], optionsByOrder[2], optionsByOrder[3], optionsByOrder[4]]};

        return byOrder;
    };

    
    



    async postQO(){ 
        var options= this.optionJoin(this.state.option1, this.state.option2, 
                                     this.state.option3, this.state.option4, this.state.option5);
        var byOrder = this.optionByOrderJoin(this.state.option1Order, this.state.option2Order,
                                             this.state.option3Order, this.state.option4Order, this.state.option5Order);
        const username = localStorage.getItem("username");
        const key = localStorage.getItem("key");

        await fetch('https://trailobyte-275015.ew.r.appspot.com/rest/question/postQO', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'username': username,
                'Authorization': 'Bearer '+key,
            },
            body: JSON.stringify({
                enunciated: this.state.enunciated,
                question: this.state.question,
                options: options,
                byOrder: byOrder,
                id: 1

            })
        })
        .then(function(response){
            if(response.ok)
                return;
            else
                return;
            })
        this.gotoApp();
        
    }



    render(){
        return(
            <div className="QOPost">
            <button onClick={this.gotoApp}>Back</button>
            <form onSubmit={this.submit}>
                {
                    this.state.error &&
                    <h3 data-test="error" onClick={this.dismissError}>
                        <button onClick={this.dismissError}>✖</button>
                        {this.state.error}
                    </h3>
                }
            <h2>Question of Order</h2>

            <div className="enunciated">
                <textarea name="myTextBox" cols="131" rows="5" placeholder="Enunciated" value = {this.state.enunciated} onChange={this.enunciatedChange}>
                    
                </textarea>     
            </div>

            <div className="question">
                <input type="text" id="postQOQ" placeholder="Question" data-test="question" value = {this.state.question} onChange={this.questionChange}/>
            </div>

            <div className="option1">
                <input type="number" placeholder="Order" id="orderOfPost" min="1" max="5" value = {this.state.option1Order} onChange={this.option1OrderChange}/>
                <input type="text" placeholder="Option1" data-test="option1" value = {this.state.option1} onChange={this.option1Change}/>
            </div>

            <div className="option2">
                <input type="number" placeholder="Order" id="orderOfPost" min="1" max="5" value = {this.state.option2Order} onChange={this.option2OrderChange}/>
                <input type="text" placeholder="Option2" data-test="option2" value = {this.state.option2} onChange={this.option2Change}/>
            </div>

            <div className="option3">
                <input type="number" placeholder="Order" id="orderOfPost" min="1" max="5" value = {this.state.option3Order} onChange={this.option3OrderChange}/>
                <input type="text" placeholder="Option3" data-test="option3" value = {this.state.option3} onChange={this.option3Change}/>
            </div>

            <div className="option4">
                <input type="number" placeholder="Order" id="orderOfPost" min="1" max="5" value = {this.state.option4Order} onChange={this.option4OrderChange}/>
                <input type="text" placeholder="Option4" data-test="option4" value = {this.state.option4} onChange={this.option4Change}/>
            </div>

            <div className="option5">
                <input type="number" placeholder="Order" id="orderOfPost" min="1" max="5" value = {this.state.option5Order} onChange={this.option5OrderChange}/>
                <input type="text" placeholder="Option5" data-test="option5" value = {this.state.option5} onChange={this.option5Change}/>
            </div>



            <div className="submitQuestion">
                <input type="submit" onClick ={()=> {this.postQO()}} value = "Post" data-test = "submit"/>
                
            </div>
            </form>
        </div>
        );
    }

}

export default withRouter(QOPost);

/*            <div className="option1ByOrder">
                <input type="text" placeholder="1st correct option i.e. option1" data-test="option1ByOrder" value = {this.state.option1ByOrder} onChange={this.option1ByOrderChange}/>
            </div>

            <div className="option2ByOrder">
                <input type="text" placeholder="2nd correct option i.e. option2" data-test="option2ByOrder" value = {this.state.option2ByOrder} onChange={this.option2ByOrderChange}/>
            </div>

            <div className="option3ByOrder">
                <input type="text" placeholder="3rd correct option i.e. option1" data-test="option3ByOrder" value = {this.state.option3ByOrder} onChange={this.option3ByOrderChange}/>
            </div>

            <div className="option4ByOrder">
                <input type="text" placeholder="4th correct option i.e. option1" data-test="option4ByOrder" value = {this.state.option4ByOrder} onChange={this.option4ByOrderChange}/>
            </div>

            <div className="option5ByOrder">
                <input type="text" placeholder="5th correct option i.e. option1" data-test="option5ByOrder" value = {this.state.option5ByOrder} onChange={this.option5ByOrderChange}/>
            </div> */