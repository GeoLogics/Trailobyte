/*global google*/
import React, {Component} from 'react';
import { GoogleMap, withGoogleMap,withScriptjs,Marker} from "react-google-maps";
import { withRouter } from 'react-router-dom';

const Map = withScriptjs(withGoogleMap(props => (
                <GoogleMap
                defaultZoom={10} 
                defaultCenter={{lat:38.7071, lng: -9.13549}}
                onClick={e => props.onMapClick(e)}
                >
                {props.marks.map((mark, index) => (
                <Marker
                    key={index}
                    position={mark}
                    onRightClick={() => props.onMapClick2()}
            />
            ))}
                </GoogleMap>
))
);


class MapTest6 extends Component{
    constructor(){
        super();
        this.state={
            directions: null,
            marks: [],
        }
    }

    setMark = e => {
        this.setState({marks: [...this.state.marks, e.latLng]});
    };

    deleteMarker = () => {
        this.setState({marks: this.state.marks.slice(0,this.state.marks.length-1)});
    }
 


    render(){
        return(
            <div style={{width:'100vw', height:'100vh'}}>
                <button onClick={this.deleteMarker}>DELETE MARKER</button>
                <Map
                googleMapURL="http://maps.googleapis.com/maps/api/js?key=AIzaSyD2HdYk7gSqjAnTchqAL4EilOOBWLjPExA"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `100%` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                onMapClick={this.setMark}
                onMapClick2={this.deleteMarker}
                marks={this.state.marks}
                >
                </Map>
            </div>
        );
    }
}

export default withRouter(MapTest6);