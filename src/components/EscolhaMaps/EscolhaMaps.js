import React, { Component } from 'react';
import '../app/App.css';
import './login.css';
import { withRouter } from "react-router-dom";
import history from '../../history';


/*FALTA RECEBER X em X trails para apresentar*/

class EscolhaMaps extends Component{

    constructor(){
        this.state={
            trails: [],
        }
    }
    componentDidMount(){
        this.gettrail()
    }

    async gettrail(id){ 
        await fetch('gettrail', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })
        .then(function(data) {
            console.log(data)
            const trail = data.trail;
            console.log(trail)
            
        })
    }
}


export default withRouter(EscolhaMaps);