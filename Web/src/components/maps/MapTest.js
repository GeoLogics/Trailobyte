import React, {Component} from 'react';
import { compose, withStateHandlers } from "recompose";
import { InfoWindow, withGoogleMap, withScriptjs, GoogleMap, Marker } from 'react-google-maps';

const Map = compose(
    withStateHandlers(() => ({
        isMarkerShown: false,
        markerPosition: null
      }), {
        onMapClick: ({ isMarkerShown }) => (e) => ({
            markerPosition: e.latLng,
            isMarkerShown:true
        })
      }),
    withScriptjs,
    withGoogleMap
)
    (props =>
        <GoogleMap
            defaultZoom={10} 
            defaultCenter={{lat:38.7071, lng: -9.13549}}
            onClick={props.onMapClick}
        >
            {props.isMarkerShown && <Marker position={props.markerPosition} />}
            
        </GoogleMap>
    )

export default class MapTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cenas:[{
                position:{lat:38.691369,lng:-9.430619},
                content: 'bocadoinferno'
              },
              {
                position:{lat:38.708095,lng: -9.484173},
                stopover: false
              },
              {
                position:{lat:38.722477,lng:-9.477907},
                content: 'abano',
                stopover: true
              },
              {
                position:{lat:38.7804,lng:-9.4989},
                content: 'cabodaroca',
                stopover: true
              },
              {
                
                position:{lat:38.803533,lng:-9.449552},
                content:'ribeiradecolares',
                stopover: true
              },
              {
                position:{lat:38.801810,lng: -9.395254},
                content: 'serradesintra',
                stopover: true
              },
              {
                position:{lat:38.8029,lng:-9.3817},
                content: 'sintra'
              },
            ],
        };
    }

    render() {
        const { cenas } = this.state;
        return (
            <div style={{width:'100vw', height:'100vh'}}>
                <Map
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD2HdYk7gSqjAnTchqAL4EilOOBWLjPExA&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{height:'100%'}}/>} 
                    containerElement={<div style={{height:'100%'}}/>}    
                    mapElement={<div style={{height:'100%'}}/>} 
                    cenas={cenas}
                />
            </div>
        )
    }
}