import React, { Component } from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps";
import { withRouter } from "react-router-dom";

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
            />
            ))}
        </GoogleMap>
    ))
);

class MapTest2 extends Component {
    state = {
        marks: []
    };

    setMark = e => {
        this.setState({marks: [...this.state.marks, e.latLng]});
    };

    deleteMarkS = () => {
        this.setState({
            marks: [],
        });
    };

    render() {
        const { marks } = this.state;
        return (
            <div style={{width:'100vw', height:'100vh'}}>
                <button onClick={this.deleteMarkS}>DELETE MARKS</button>
                <Map
                    googleMapURL="http://maps.googleapis.com/maps/api/js?key=AIzaSyD2HdYk7gSqjAnTchqAL4EilOOBWLjPExA"
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: `100%` }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                    onMapClick={this.setMark}
                    marks={marks}
                />;
            </div>
        );
    }
}

export default withRouter(MapTest2);