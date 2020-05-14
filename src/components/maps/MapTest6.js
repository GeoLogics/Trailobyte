/*global google*/
import React, {Component} from 'react';
import { GoogleMap, withGoogleMap,withScriptjs,Marker,DirectionsRenderer} from "react-google-maps";
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

const Map = withScriptjs(
    withGoogleMap(props => (
        <GoogleMap
        defaultZoom={10} 
        defaultCenter={{lat:38.7071, lng: -9.13549}}
        >
            {props.marks.map((mark, index) => (
                <Marker
                key={index}
                position={mark}

            />
            ))}
        
        {props.directions && <DirectionsRenderer directions={props.directions} />}
        </GoogleMap>
    ))
);

var data1 = {		"name":"SintraCascais2",
                            "description":"percurso de cascais a sintra",
            "trailImg":"SintraCascais.jpg",
            "creator": "xd1",
            "start":"Boca do Inferno",
            "end":"Sintra",
            "markers":[
                {
                    "name": "Boca do Inferno",
                    "coords":{"lat":38.691369,"lng":-9.430619},
                    "content":"Acidente geológico integrado num campo de lapiás, que corresponde a uma enorme caverna cujo teto abateu, devido à força erosiva das ondas e à dissolução dos calcários pela água das chuvas. A visitar ainda alguns elementos singulares, tais como a chaminé vulcânica na praia do Guincho, o sistema dunar Guincho-Oitavos e a duna consolidada de Oitavos. Prosseguir pela N247;",
                    "imgURL":"bocadoinferno.jpg",
                    "iconImg":
                    {
                        "url":"/images/start.png",
                        "size":{"width":512,"height":512},
                        "scaledSize":{"width":56,"height":56},
                        "origin":{"x":0,"y":0},
                        "anchor":{"x":28,"y":56}
                    },
                    "stopover": true
                },
                {
                    "coords":{"lat":38.708095,"lng":-9.484173},
                    "iconImg":null,
                    "content": null,
                    "stopover":false
                },
                {
                    "name":"Abano",
                    "coords":{"lat":38.722477,"lng":-9.477907},
                    "content":"Linha de costa, pontuada pelo Forte do Guincho, apresenta grande interesse em termos geológicos.",
                    "imgURL":"abano.jpg",
                    "iconImg":null,
                    "stopover":true	
                },
                {	
                    "name":"Cabo da Roca",
                    "coords":{"lat":38.7804,"lng":-9.4989},
                    "content":"O “Promontório Magno” dos Romanos, é um miradouro natural por excelência sobre o mar, que em dias límpidos permite a visibilidade até às Berlengas.",
                    "imgURL":"cabodaroca.jpg",
                    "iconImg":null,
                    "stopover":true
                },
                {
                    "name":"Ribeira de Colares",
                    "coords":{"lat":38.803533,"lng":-9.449552},
                    "content":"É dominada pela depressão onde a sinuosa ribeira marca o seu percurso em direção ao mar.",
                    "imgURL":"ribeiradecolares.jpg",
                    "iconImg":null,
                    "stopover":true				
                },
                {
                    "name":"Serra de Sintra",
                    "coords":{"lat":38.80181,"lng":-9.395254},
                    "content":"Apresenta uma forte identidade que lhe advém de um peso histórico e cultural indiscutível.",
                    "imgURL":"serradesintra.jpg",
                    "iconImg":null,
                    "stopover":true
                },
                {
                    "name":"Sintra",
                    "coords":{"lat":38.8029,"lng":-9.3817},
                    "content":"Situada na encosta norte da serra de Sintra, o enquadramento harmonioso da vila de Sintra, parques e quintas com os seus palácios e edifícios senhoriais, criaram “uma combinação única de parques e jardins que influenciou o desenvolvimento das paisagens na Europa” (UNESCO, 1996). Tanto em Sintra como na sua envolvente existem numerosos locais a visitar como o Parque da Pena, Quinta da Regaleira, Convento dos Capuchos, Pedras Irmãs, Anta de Adrenunes e Peninha.",
                    "imgURL":"sintra.jpg",
                    "iconImg":
                    {
                        "url":"/images/finish.png",
                        "size":{"width":512,"height":512},
                        "scaledSize":{"width":56,"height":56},
                        "origin":{"x":0,"y":0},
                        "anchor":{"x":28,"y":56}
                    },
                    "stopover":true
                }
            ],
            "avgRating": 0.0,
            "nRatings": 0,
            "dist":25.0,
            "verified": false	
        };

class MapTest6 extends Component{
    constructor(props){
        super(props);
        this.state={
            directions: props.directions,
            marks: props.markers,
            marksname: props.marksname,
            marksdesc: props.marksdesc,
            marksstopat: props.marksstopat,
            name: props.name,
            description: props.description,
            start: props.start,
            end: props.end,
            trailImg: null,
            dist: props.dist,
            avgRating: props.avgRating,
            nRatings: props.nRatings,
            verified: props.verified,
        };
    }
    

    getDirection = () => {
        const directionsService = new google.maps.DirectionsService();
        const markers = this.state.marks;
        const markersname = this.state.marksname;
        const markersdesc = this.state.marksdesc;
        const markersstopat = this.state.marksstopat;

        this.setState({directions: null});

        const origin = markers[0];
        const destination = markers[Object.keys(markers).length-1];
        const waypts = [];

        for( let i=1; i<Object.keys(markers).length-1;i++){
            let location = {
                location: markers[i],
                stopover: markersstopat[i],
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
                this.setState({directions: result});
              let distance = _.flatMap(result.routes, route => _.flatMap(route.legs, leg => leg.distance.value));  
              let sum = _.sum(distance);
              sum = sum/1000;
              this.setState({dist: sum});
            } else {
              console.error(`error fetching directions ${result}`);
            }
          });
    }

    activate = () => {
            this.setState({
                description: data1.description,
                start: data1.start,
                end: data1.end,
                trailImg: null,
                dist: data1.dist,
                avgRating: data1.avgRating,
                nRatings: data1.nRatings,
                verified: data1.verified,
            }); 

                
            for(let i = 0; i<Object.keys(data1.markers).length-1;i++){
                this.updateState(i);
                this.forceUpdate();
              
            }
        }

        updateState = i => {
            this.setState({
                marks: [...this.state.marks, data1.markers[i].coords],
                marksname: [...this.state.marksname, data1.markers[i].name],
                marksdesc: [...this.state.marksdesc, data1.markers[i].content],
                marksstopat: [...this.state.marksstopat, data1.markers[i].stopover],
            });
        }



    async load(name){
        const username = localStorage.getItem("username");
        const key = localStorage.getItem("key");

        var myHeaders = new Headers();
        myHeaders.append("username", username);
        myHeaders.append("Authorization", "Bearer" + key);

        

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };
        await fetch('http://localhost:8080/rest/trail/gettrail/'+ name,requestOptions)
        .then(function(response){ 
            if(response.ok){
                console.log(response)
                return response.json(); 
            }else{
                return;
            }
            })
        .then(function(data){
            console.log(data);
            data1 = {		"name":"SintraCascais2",
                            "description":"percurso de cascais a sintra",
            "trailImg":"SintraCascais.jpg",
            "creator": "xd1",
            "start":"Boca do Inferno",
            "end":"Sintra",
            "markers":[
                {
                    "name": "Boca do Inferno",
                    "coords":{"lat":38.691369,"lng":-9.430619},
                    "content":"Acidente geológico integrado num campo de lapiás, que corresponde a uma enorme caverna cujo teto abateu, devido à força erosiva das ondas e à dissolução dos calcários pela água das chuvas. A visitar ainda alguns elementos singulares, tais como a chaminé vulcânica na praia do Guincho, o sistema dunar Guincho-Oitavos e a duna consolidada de Oitavos. Prosseguir pela N247;",
                    "imgURL":"bocadoinferno.jpg",
                    "iconImg":
                    {
                        "url":"/images/start.png",
                        "size":{"width":512,"height":512},
                        "scaledSize":{"width":56,"height":56},
                        "origin":{"x":0,"y":0},
                        "anchor":{"x":28,"y":56}
                    },
                    "stopover": true
                },
                {
                    "coords":{"lat":38.708095,"lng":-9.484173},
                    "iconImg":null,
                    "content": null,
                    "stopover":false
                },
                {
                    "name":"Abano",
                    "coords":{"lat":38.722477,"lng":-9.477907},
                    "content":"Linha de costa, pontuada pelo Forte do Guincho, apresenta grande interesse em termos geológicos.",
                    "imgURL":"abano.jpg",
                    "iconImg":null,
                    "stopover":true	
                },
                {	
                    "name":"Cabo da Roca",
                    "coords":{"lat":38.7804,"lng":-9.4989},
                    "content":"O “Promontório Magno” dos Romanos, é um miradouro natural por excelência sobre o mar, que em dias límpidos permite a visibilidade até às Berlengas.",
                    "imgURL":"cabodaroca.jpg",
                    "iconImg":null,
                    "stopover":true
                },
                {
                    "name":"Ribeira de Colares",
                    "coords":{"lat":38.803533,"lng":-9.449552},
                    "content":"É dominada pela depressão onde a sinuosa ribeira marca o seu percurso em direção ao mar.",
                    "imgURL":"ribeiradecolares.jpg",
                    "iconImg":null,
                    "stopover":true				
                },
                {
                    "name":"Serra de Sintra",
                    "coords":{"lat":38.80181,"lng":-9.395254},
                    "content":"Apresenta uma forte identidade que lhe advém de um peso histórico e cultural indiscutível.",
                    "imgURL":"serradesintra.jpg",
                    "iconImg":null,
                    "stopover":true
                },
                {
                    "name":"Sintra",
                    "coords":{"lat":38.8029,"lng":-9.3817},
                    "content":"Situada na encosta norte da serra de Sintra, o enquadramento harmonioso da vila de Sintra, parques e quintas com os seus palácios e edifícios senhoriais, criaram “uma combinação única de parques e jardins que influenciou o desenvolvimento das paisagens na Europa” (UNESCO, 1996). Tanto em Sintra como na sua envolvente existem numerosos locais a visitar como o Parque da Pena, Quinta da Regaleira, Convento dos Capuchos, Pedras Irmãs, Anta de Adrenunes e Peninha.",
                    "imgURL":"sintra.jpg",
                    "iconImg":
                    {
                        "url":"/images/finish.png",
                        "size":{"width":512,"height":512},
                        "scaledSize":{"width":56,"height":56},
                        "origin":{"x":0,"y":0},
                        "anchor":{"x":28,"y":56}
                    },
                    "stopover":true
                }
            ],
            "avgRating": 0.0,
            "nRatings": 0,
            "dist":25.0,
            "verified": false	
        };
        });
            this.setState({
                description: data1.description,
                start: data1.start,
                end: data1.end,
                trailImg: null,
                dist: data1.dist,
                avgRating: data1.avgRating,
                nRatings: data1.nRatings,
                verified: data1.verified,
            });
                
            const markers = data1.markers;
            for(let i = 0; i<Object.keys(markers).length-1;i++){
                this.setState({marks: [...this.state.marks, markers.coords]});
                this.setState({marksname: [...this.state.marksname, markers.name]});
                this.setState({marksdesc: [...this.state.marksdesc, markers.content]});
                this.setState({marksstopat: [...this.state.marksstopat, markers.stopover]});
            }
    };
 


    render(){
        return(
            <div style={{width:'100vw', height:'100vh'}}>
                <Map
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD2HdYk7gSqjAnTchqAL4EilOOBWLjPExA"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `100%` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                marks={this.state.marks}
                directions={this.state.directions}
                >
                </Map>
                <button onClick={this.activate}>CARREGA CARALHO</button>
            </div>
        );
    }
}

export default withRouter(MapTest6);