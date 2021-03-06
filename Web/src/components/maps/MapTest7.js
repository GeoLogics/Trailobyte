import { Component } from "react";
import "./MapTest6";

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
class MapTest7 extends Component{
    render(){
        return(
            <MapTest6
                description= {data1.description}
                start= {data1.start}
                end = {data1.end}
                trailImg= {null}
                dist= {data1.dist}
                avgRating= {data1.avgRating}
                nRatings= {data1.nRatings}
                verified= {data1.verified}
                marks=.coords;
                this.setState({marksname: [...this.state.marksname, markers.name]});
                this.setState({marksdesc: [...this.state.marksdesc, markers.content]});
                this.setState({marksstopat: [...this.state.marksstopat, markers.stopover]});
                ></MapTest6>
        );
    }
}