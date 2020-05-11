function initMap(){
    // Map options
    var options = {
      zoom:8,
      center:{lat:39.294392,lng: -7.423416}
    }

    //directions variables
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer({
      suppressMarkers: true
    });


    // New map
    var map = new google.maps.Map(document.getElementById('map'), options);

    directionsDisplay.setMap(map);
    


    // Listen for click on map
    google.maps.event.addListener(map, 'click', function(event){
      // Add marker
      addMarker({coords:event.latLng});
    });

    /*
    // Add marker
    var marker = new google.maps.Marker({
      position:{lat:42.4668,lng:-70.9495},
      map:map,
      icon:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
    });

    var infoWindow = new google.maps.InfoWindow({
      content:'<h1>Lynn MA</h1>'
    });

    marker.addListener('click', function(){
      infoWindow.open(map, marker);
    });
    */
    
    var startImg = {
      url: '/images/start.png',
      size: new google.maps.Size(512,512),
      scaledSize: new google.maps.Size(56,56),
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(28, 56) // anchor
    };

    var finishImg = {
      url: '/images/finish.png',
      size: new google.maps.Size(512,512),
      scaledSize: new google.maps.Size(56,56),
      origin: new google.maps.Point(0,0), // origin
      anchor: new google.maps.Point(28, 56) // anchor
    };


    var bocadoinferno ='<h1>Boca do Inferno</h1><img src="/images/bocadoinferno.jpg" alt="picture"><h1>Acidente geológico integrado num campo</h1><h1>de lapiás, que corresponde a</h1><h1>uma enorme caverna cujo teto</h1><h1>abateu, devido à força erosiva</h1><h1>das ondas e à dissolução dos</h1><h1>calcários pela água das chuvas.</h1><h1>A visitar ainda alguns elementos</h1><h1>singulares, tais como a chaminé vulcânica</h1><h1>na praia do Guincho, o sistema dunar</h1><h1>Guincho-Oitavos e a duna consolidada</h1><h1>de Oitavos. Prosseguir pela N247;</h1>';
    var abano = '<h1>Abano</h1><img src="/images/abano.jpg" alt="picture"><h1>Linha de costa, pontuada pelo</h1><h1>Forte do Guincho, apresenta grande</h1><h1>interesse em termos geológicos. O</h1><h1>troço de costa compreendido entre a</h1><h1>ponta da Abelheira e a praia do Abano</h1><h1>exibe grande diversidade geológica, com</h1><h1>o aparecimento de numerosos filões</h1><h1>eruptivos, que por vezes, se chegam a</h1><h1>entrecruzar.Toda esta unidade apresenta</h1><h1>grande importância para a fauna, pois</h1><h1>enquanto a faixa costeira, pela fraca</h1><h1>presença humana, permite a fixação das</h1><h1>espécies animais, a faixa terrestre faculta</h1><h1>importantes habitats de alimentação.</h1><h1>Encontram-se nesta unidade espécies</h1><h1>como o Bufo-real Bubo bubo, a </h1><h1>Víboracornuda Vipera latastei e algumas</h1><h1>espécies de morcegos Rhinolophus</h1><h1>ferrumequim, Rhinolophus hipposideros,</h1><h1>Myotis myotis. Continuar pela N247, e na</h1><h1>localidade de Azoia, entrar na estrada de</h1><h1>acesso ao cabo da Roca;</h1>';
    var cabodaroca = '<h1>Cabo da Roca</h1><img src="/images/cabodaroca.jpg" alt="picture"><h1>O “Promontório Magno” dos Romanos, é um</h1><h1>miradouro natural por excelência sobre o mar,</h1><h1>que em dias límpidos permite a visibilidade</h1><h1>até às Berlengas.A imponente arriba</h1><h1>granítica de 140 m sobre o vasto oceano</h1><h1>Atlântico não é, no entanto, o ponto</h1><h1>mais alto de toda a costa portuguesa.</h1><h1>Um pouco mais a norte, sobranceiro à</h1><h1>praia da Aroeira, encontra-se o cabeço</h1><h1>das Oureças que se eleva a 154m. O</h1><h1>Cruzeiro do Cabo da Roca marca o</h1><h1>ponto mais ocidental da Europa</h1><h1>continental e o farol, a poucos metros</h1><h1>de distância do cruzeiro, indica a</h1><h1>proximidade de terra para quem navega</h1><h1>ao largo. Nos dias de nevoeiro, o que o</h1><h1>cabo perde em vista, ganha em</h1><h1>sonoridade: ao rumor do mar junta-se o</h1><h1>“ronco” do farol a avisar as</h1><h1>embarcações. Nesta faixa de território</h1><h1>encontra-se um inestimável valor</h1><h1>ambiental: a dificuldade de acesso à</h1><h1>costa (baixo nível de perturbação do</h1><h1>habitat) e uma vegetação rasteira</h1><h1>(facilidade de acesso ao solo) permitem</h1><h1>uma importante presença quer de</h1><h1>avifauna residente como o Falcão-peregrino</h1><h1>Falco peregrinus, a Águia-deasa-redonda</h1><h1>Buteo buteo ou Bufo-real</h1><h1>Bubo bubo, quer de avifauna migratória</h1><h1>como o Andorinhão-real Apus melba</h1><h1>entre outros. Destacam-se como</h1><h1>elementos singulares: Cabo da Roca (o</h1><h1>antigo "Promontorium Magnum" dos</h1><h1>Romanos), Pedra da Urza e o Forte do</h1><h1>Espinhaço ou Forte da Nossa Senhora</h1><h1>da Roca. Regressar à N247 para Colares;</h1>';
    var ribeiradecolares = '<h1>Ribeira de Colares</h1><img src="/images/ribeiradecolares.jpg" alt="picture"><h1>É dominada pela depressão onde a</h1><h1>sinuosa ribeira marca o seu percurso</h1> <h1>em direção ao mar.Azona compreendida</h1> <h1>entre Almoçageme e a praia das Maçãs,</h1><h1>considerada o “solar” da vinha de Colares,</h1><h1>tem vindo a sofrer alterações com a</h1> <h1>substituição por construções para habitação.</h1><h1>Destacam-se como elementos</h1><h1>singulares: Capela de São Mamede de</h1><h1>Janas, Banzão, pista de pegadas de</h1><h1>Dinossáurios, a antiga linha dos elétricos</h1><h1>Sintra/praia das Maçãs e o Fojo da</h1><h1>Adraga. Seguir pela N375 para Sintra;</h1>';
    var serradesintra = '<h1>Serra de Sintra</h1><img src="/images/serradesintra.jpg" alt="picture"><h1>Apresenta uma forte identidade que</h1><h1>lhe advém de um peso histórico e</h1><h1>cultural indiscutível.A complexidade</h1><h1>e a combinação entre património</h1><h1>”natural” e património construído</h1><h1>tornam-na ímpar.A serra apresenta-se</h1><h1>luxuriante, em que parques e quintas</h1><h1>históricas contribuem com autênticos</h1><h1>jardins botânicos, com espécies de</h1><h1>todo o mundo, como o Parque de</h1><h1>Monserrate e o Palácio de Seteais;</h1>';
    var sintra = '<h1>Sintra</h1><img src="/images/sintra.jpg" alt="picture"><h1>Situada na encosta norte da</h1><h1>serra de Sintra, o enquadramento</h1><h1>harmonioso da vila de Sintra, parques e</h1><h1>quintas com os seus palácios e edifícios</h1><h1>senhoriais, criaram “uma combinação</h1><h1>única de parques e jardins que</h1><h1>influenciou o desenvolvimento das</h1><h1>paisagens na Europa” (UNESCO, 1996).</h1><h1>Tanto em Sintra como na sua envolvente</h1><h1>existem numerosos locais a visitar como</h1><h1>o Parque da Pena, Quinta da Regaleira,</h1><h1>Convento dos Capuchos, Pedras Irmãs,</h1><h1>Anta de Adrenunes e Peninha.</h1>';







    // Array of markers
    var markers = [
      {
        coords:{lat:38.691369,lng:-9.430619},
        iconImage: startImg,
        content: bocadoinferno
      },
      {
        coords:{lat:38.708095,lng: -9.484173},
        iconImage: null,
        stopover: false
      },
      {
        coords:{lat:38.722477,lng:-9.477907},
        iconImage: true,
        content: abano,
        stopover: true
      },
      {
        coords:{lat:38.7804,lng:-9.4989},
        iconImage: true,
        content: cabodaroca,
        stopover: true
      },
      {
        
        coords:{lat:38.803533,lng:-9.449552},
        iconImage: true,
        content:ribeiradecolares,
        stopover: true
      },
      {
        coords:{lat:38.801810,lng: -9.395254},
        iconImage: true,
        content: serradesintra,
        stopover: true
      },
      {
        coords:{lat:38.8029,lng:-9.3817},
        iconImage:finishImg,
        content: sintra
      },
      
    ];

    var locations = markers.slice(1,markers.length-1).map(e => {return {location: e.coords, stopover: e.stopover}});
    
    console.log(locations);

    //directions logic
    calculateAndDisplayRoute(directionsService, directionsDisplay)


    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
      directionsService.route({
        origin: markers[0].coords,
        waypoints: locations,
        destination: markers[6].coords,
        travelMode: 'DRIVING'
      }, function(response, status) {
        if (status === 'OK') {
          directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    }
  

    // Loop through markers
    for(var i = 0;i < markers.length;i++){
      // Add marker
      if(markers[i].iconImage)
        addMarker(markers[i]);
    }

    // Add Marker Function
    function addMarker(props){
      var marker = new google.maps.Marker({
        position:props.coords,
        map:map,
        //icon:props.iconImage
      });

      // Check for customicon
      if(props.iconImage){
        // Set icon image
        marker.setIcon(props.iconImage);
      }

      // Check content
      if(props.content){
        var infoWindow = new google.maps.InfoWindow({
          content:props.content
        });

        marker.addListener('click', function(){
         infoWindow.open(map, marker);
        });
      }
    }
  }