import React, { Component } from 'react';
import { render } from 'react-dom';
import { withScriptjs } from "react-google-maps";
import MapTest4 from './MapTest4';
import { withRouter } from "react-router-dom";

class MapTest42 extends Component{

render(){
    const MapLoader = withScriptjs(MapTest4);

    return (
      <div style={{width:'100vw', height:'100vh'}}>
        <MapLoader
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD2HdYk7gSqjAnTchqAL4EilOOBWLjPExA&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: '100%'}} />}
        onMapClick={this.setMark}
     />
    </div>
  );
}

}
  export default withRouter(MapTest42);