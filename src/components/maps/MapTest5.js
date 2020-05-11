/*global google*/
import React, { Component } from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer} from "react-google-maps";
import { withRouter } from "react-router-dom";
import './MapTest5.css';
import history from '../../history';


const Map = withScriptjs(
    withGoogleMap(props => (
        <GoogleMap
        defaultZoom={10} 
        defaultCenter={{lat:38.7071, lng: -9.13549}}
        onClick={e => props.onMapClick(e)}

        >
            {props.marks.map((mark, index) => (
                <Marker
                key={index}
                position={mark}
                onClick={index => props.onMapClick3(index)}
            />
            ))}
        {props.directions && <DirectionsRenderer directions={props.directions} />}
        </GoogleMap>
    ))
);


class MapTest5 extends Component {
    state = {
        name: '',
        description:'',
        creator: '',
        marks: [],
        marksname: [],
        marksdesc: [],
        marksstopat: [],
        directions: null,
        error: '',
    };

    DefaultError = () => {
        this.setState({ error: '' });
    }

    submit = event => {
        event.preventDefault();

        this.changeStopAt();
        this.changeDescMarker();
        this.changeNameMarker();

        var asd = this.constructorMarker();
        console.log(asd);

        if(!this.state.name){
            return this.setState({error: 'Name invalid'});
        }

        if(!this.state.creator){
            return this.setState({error: 'Password invalid'});
        }

        if(!this.state.marks){
            return this.setState({error: 'No waypoints'});
        }
        
        return this.setState({ error: '' });
    }

    changeName = event => {
        this.setState({name: event.target.value});
    }

    changeDescription = event =>{
        this.setState({description: event.target.value});
    }
    changeCreator = event =>{
        this.setState({creator: event.target.value});
    }

    setMark = e => {
        this.setState({marks: [...this.state.marks, e.latLng]});
        this.setState({marksstopat: [...this.state.marksstopat, 'true']});
        this.setState({marksdesc: [...this.state.marksdesc, '']});
        if(Object.keys(this.state.marks).length>1)
            this.getDirection();
        this.createMarkerList(Object.keys(this.state.marks).length-1);
    };

    deleteMarkS = () => {
        this.setState({
            marks: [],
            directions: null,
        });
        this.removeMarkerListAll();
    };

    deleteMarker = index => {
        var array = [...this.state.marks]; // make a separate copy of the array
        array.splice(index, 1);
        this.setState({marks: array});
       // this.setState({marks: this.state.marks.slice(0,this.state.marks.length-1)});
        this.getDirection();
        this.removeMarkerList();
    }

    getDirection = () => {
        const directionsService = new google.maps.DirectionsService();
        const markers = this.state.marks;
        this.setState({
            directions: null,
        });
        const origin = markers[0];
        const destination = markers[Object.keys(markers).length-1];
        const waypts = [];

        for( let i=1; i<Object.keys(markers).length-1;i++){
            let location = {
                location: markers[i],
            };
            waypts.push(location);
        }

        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
            waypoints: waypts,
          }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              this.setState({
                directions: result,
              });
            } else {
              console.error(`error fetching directions ${result}`);
            }
          });
    }

    removeMarkerList = () => {
        document.getElementById("barra").querySelector(".list").remove();
    }

    removeMarkerListAll = () => {
        for(let k=0; k<Object.keys(this.state.marks).length;k++){
            document.getElementById("barra").querySelector(".list").remove();
        }
    }

    createMarkerList = () => {
        
        const markers = this.state.marks;
        // calculate the length of array
        let listLength = Object.keys(markers).length;
        var container = document.getElementById("barra");

        if(listLength>1){

            for(let k=0; k<listLength-1;k++){
                document.getElementById("barra").querySelector(".list").remove();
            }
        }

        for(let j=0; j<listLength;j++){
            // Create the Unordered list if there are elements present in the array  
                var myList = document.createElement("ul");
                // add a class name to list
                myList.className="list";
                // create list item for every element 
                var listItem = document.createElement("li");


                var div = document.createElement("div");
                var input1 = document.createElement("input");
                input1.setAttribute("type","text");
                input1.setAttribute("placeholder","Marker name");
                input1.setAttribute("id", "name" + j + "");
                var div2 = document.createElement("div");
                var input2 = document.createElement("input");
                input2.setAttribute("type","text");
                input2.setAttribute("placeholder","Marker Description");
                input2.setAttribute("id", "desc" + j + "");
            if(listLength>2 && j<listLength-1 && j>0){
                var div3 = document.createElement("div");
                var text = document.createElement("p");
                text.setAttribute("id","markertext");
                var input3 = document.createElement("input");
                input3.setAttribute("type","checkbox");
                input3.setAttribute("id",j);
                input3.setAttribute("className","check");
                var temp = document.createTextNode("StopAt?");
                text.appendChild(temp);
            }
            // create a text node to store value
            var listValue = document.createTextNode(j);
            
            // append the value in the list item
            listItem.appendChild(div);
            listItem.appendChild(div2);
            if(listLength>2 && j<listLength-1 && j>0){
                listItem.appendChild(div3);
                div3.appendChild(text);
                div3.appendChild(input3);
                
            }
            div.appendChild(input1);
            div2.appendChild(input2);
            listItem.appendChild(listValue);
            
            // append the list item in the list
            myList.appendChild(listItem);
            // append the list in the container
          container.appendChild(myList);
        }
    }

    cenas = () => {

    }

    changeStopAt = () => {
        var array = this.state.marksstopat;
        if(Object.keys(this.state.marks).length > 2){
            for(let i = 1; i < Object.keys(this.state.marks).length-1; i++){
                var x = document.getElementById(i);
                if(!x.checked)
                    array[i] = 'false';
             }
        }
        this.setState({marksstopat:array});
    }

    changeNameMarker = () => {
        var array = this.state.marksname;
            for(let i = 0; i < Object.keys(this.state.marks).length; i++){
                var x = document.getElementById("name" + i + "");
                array[i] = x.value;
             }
        this.setState({marksname:array});
    }

    changeDescMarker = () => {
        var array = this.state.marksdesc;
            for(let i = 0; i < Object.keys(this.state.marks).length; i++){
                var x = document.getElementById("desc" + i + "");
                array[i] = x.value;
             }
        this.setState({marksdesc:array});
    }

    gotoApp = () => {
        history.push("/home");
    }

    constructorMarker = () =>{
        var markers = [];
        for(let i=0; i<Object.keys(this.state.marks).length;i++){
            var temp = {
                name: this.state.marksname[i],
                coords: this.state.marks[i],
                content: this.state.marksdesc[i],
                imgURL: null,
                iconImg:null,
                stopover: this.state.marksstopat[i],
            }
            //console.log(temp);
            markers.push(temp);
        }
        //console.log(markers);
        return markers;
    }


    async postTrail(name,description,creator,marks,marksname,marksdesc,marksstopat){
        var formdata = new FormData();
        formdata.append("json","");
        var json = {
            name: name,
            description: description,
            trailImg: null,
            creator: creator,
            start: marksname[0],
            end: marksname[Object.keys(this.state.marks).length-1],
            
        };
        await fetch('post', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formdata,
        })
        .then(function(response){ return response.ok; })
        this.gotoApp();
        
        }

    render() {
        return (
            <div style={{width:'100vw', height:'100vh'}}>
                <button onClick={this.deleteMarkS}>DELETE MARKS</button>
                <div id="barra">
                <form onSubmit={this.submit}>
                    {
                        this.state.error &&
                        <h3 data-test="error" onClick={this.DefaultError}>
                            <button onClick={this.DefaultError}>✖</button>
                            {this.state.error}
                        </h3>
                    }
                    <input type="submit" onClick ={this.cenas} value = "Submit"/>
                    <ul>
                        <li style={{clear:'both'}}>
                            <a>Click on Map to add waypoints</a>
                        </li>
                        <li style={{clear:'both'}}>
                            <a>Right Click on the waypoint to remove</a>
                        </li>
                        <li style={{clear:'both'}}>
                            <a>You can add waypoint only for the purpose of passing by</a>
                        </li>
                    </ul>
                    <ul>
                        <input type="text" placeholder="Trail name" id="trailname" value = {this.state.name} onChange={this.changeName}></input>
                        <input type="text" placeholder="Description" id="description" value = {this.state.description} onChange={this.changeDescription}></input>
                        <input type="text" placeholder="Creator" id="creator" value = {this.state.creator} onChange={this.changeCreator}></input>
                    </ul>
                    </form>
                </div>
                <Map
                    googleMapURL="http://maps.googleapis.com/maps/api/js?key=AIzaSyD2HdYk7gSqjAnTchqAL4EilOOBWLjPExA"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `100%` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    onMapClick={this.setMark}
                    onMapClick3={this.deleteMarker}
                    marks={this.state.marks}
                    directions={this.state.directions}
                />
            </div>
        );
    }
}

export default withRouter(MapTest5);