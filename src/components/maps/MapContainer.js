import {
    GoogleMap, withGoogleMap, Marker, InfoWindow, withScriptjs
  } from "react-google-maps";
import React, { Component } from "react";
import "./MapContainer.css";
 

const WrappedMap = withScriptjs(withGoogleMap(props => {
    return(
        <GoogleMap 
        defaultZoom={10} 
        defaultCenter={{lat:38.7071, lng: -9.13549}}
    >
        </GoogleMap>
    )
}));


var index = 2;

export default class MapContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            markers:[
                {
                    key: 1,
                    position:{lat:38.7071, 
                            lng: -9.13549,
                    }
                }
            ]
          }

          this.handleMapClick=this.handleMapClick.bind(this);
      }

      handleMapClick(event) {
        var {markers} = this.state;
        markers.push(
            {
              position: event.latLng,
              key: index,// Add a key property for: http://fb.me/react-warning-keys
            }
        );
        index++;
        console.log(index);
        this.setState({markers});
    }

    handleMarkerRightclick (index, event) {
        /*
         * All you modify is data, and the view is driven by data.
         * This is so called data-driven-development. (And yes, it's now in
         * web front end and even with google maps API.)
         */
        var {markers} = this.state;
        markers.splice([index, 1]);
        this.setState({markers});
      }

    handleMarkerClose(targetMarker){
        this.setState({
            markers: this.state.markers.map(marker => {
                if(marker === targetMarker) marker.showInfo = false
                return marker;
            }),
        })
    }

      render() {
        return (
            <div style={{width:'100vw', height:'100vh'}}>
            <WrappedMap googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyD2HdYk7gSqjAnTchqAL4EilOOBWLjPExA`}   
                loadingElement={<div style={{height:'100%'}}/>} 
                containerElement={<div style={{height:'100%'}}/>}    
                mapElement={<div style={{height:'100%'}}/>}    
                onMapClick={console.log("click")}
                />
            </div>
        )
    }
}