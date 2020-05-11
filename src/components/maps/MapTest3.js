/* global google */

import React, { Component } from "react";
import {compose,withProps , lifecycle}  from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer} from "react-google-maps";
import { withRouter } from "react-router-dom";


const Map = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD2HdYk7gSqjAnTchqAL4EilOOBWLjPExA&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      const DirectionsService = new google.maps.DirectionsService();

      DirectionsService.route({
        origin: {lat:38.691369,lng:-9.430619},
        destination: {lat:38.8029,lng:-9.3817},
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints:[{
            location:{lat:38.708095,lng: -9.484173},
            stopover: false,
        },
        {
            location:{lat:38.722477,lng:-9.477907},
        },
        {
            location:{lat:38.7804,lng:-9.4989},
        },
        {
            location: {lat:38.803533,lng:-9.449552},
        },
        {
            location:{lat:38.801810,lng: -9.395254},
        }
           ],
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
  })
)(props =>
  <GoogleMap
    defaultZoom={7}
    defaultCenter={new google.maps.LatLng(41.8507300, -87.6512600)}
  >
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
);

class MapTest3 extends Component{
    render() {
        return(
            <div style={{width:'100vw', height:'100vh'}}>
                <Map></Map>
            </div>
        )
    }
}

export default withRouter(MapTest3);