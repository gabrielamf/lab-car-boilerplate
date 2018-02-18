var btnSearch = document.getElementById('btn-search');
var btnRoute = document.getElementById('btn-route');
var maps = document.getElementById('map');
var origin = document.getElementById('origin');
var destiny = document.getElementById('destiny');
btnSearch.addEventListener('click', searchPosition);

// validar input
var validateOrigin = false;
var validateDestiny = false;

function activeBtn() {
  if(validateOrigin && validateDestiny) {
    btnRoute.classList.remove('disabled');
    btnRoute.classList.add('active');
  }
};
function desactiveBtn() {
  btnRoute.classList.add('disabled');
  btnRoute.classList.remove('active');
}
origin.addEventListener('input', function(event) {
  console.log(event.target);
  if (this.value.length > 0) {
    validateOrigin = true;
    activeBtn();
  } else {
    desactiveBtn();
  }
});
destiny.addEventListener('input', function() {
  if (this.value.length > 0) {
    validateDestiny = true;
    activeBtn();
  } else {
    desactiveBtn();
  }
});

function initMap() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  initAutocomplete();
  initPosition = {lat: -12.020651498087096, 
    lng: -76.93456887128904};
  var map = new google.maps.Map(maps, {
    zoom: 5,
    center: initPosition
  });
  var marker = new google.maps.Marker({
    position: initPosition,
    map: map
  });
  directionsDisplay.setMap(map);
  btnRoute.addEventListener('click', function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  });
}

function initAutocomplete() {
  var autocompleteorigin = new google.maps.places.Autocomplete(origin);
  var autocompleteDestiny = new google.maps.places.Autocomplete(destiny);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  directionsService.route({
    origin: origin.value,
    destination: destiny.value,
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Ingrese una dirección correcta porfavor');
    }
  });
}

function searchPosition() {
  // limpiar inputs
  origin.value = '';
  destiny.value = '';
  if (navigator.geolocation) {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    navigator.geolocation.getCurrentPosition(function(position) {
      var myPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var map = new google.maps.Map(maps, {
        zoom: 18,
        center: myPosition
      });
      var marker = new google.maps.Marker({
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: myPosition,
        title: 'Estoy aquí',
        icon: 'assets/images/car_icon_fAM_icon.ico',
      });
      marker.addListener('click', function() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      });
      directionsDisplay.setMap(map);
      btnRoute.addEventListener('click', function() {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
      });
    });
  } else {
    console.log('Su navegador no soporta Geolocalización');
  }
}