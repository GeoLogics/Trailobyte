/*global google*/
import React, { Component } from "react";
import {
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
  Marker
} from "react-google-maps";

class MapTest4 extends Component {
  state = {
    directions: null,
    marks:[],
  };

  componentDidMount() {
    const directionsService = new google.maps.DirectionsService();

    const origin = this.state.marks[1];
    const destination = this.state.marks[this.state.marks.length];

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }

  setMark = e => {
    this.setState({marks: [...this.state.marks, e.latLng]});
};

  render() {
    const GoogleMapExample = withGoogleMap(props => (
      <GoogleMap
        defaultCenter={{ lat: 40.756795, lng: -73.954298 }}
        defaultZoom={10}
        onClick={e => props.onMapClick(e)}
      >
        {props.marks.map((mark, index) => (
                        <Marker
                        key={index}
                        position={mark}
                    />
                    ))}
        <DirectionsRenderer
          directions={this.state.directions}
        />
      </GoogleMap>
    ));

    return (
      <div>
        <GoogleMapExample
          containerElement={<div style={{ height: '100vh'}} />}
          mapElement={<div style={{ height: `100vh`}} />}
        />
      </div>
    );
  }
}

export default MapTest4;