import React, { Component } from 'react';
import './App.css';

// Import components
import MyMap from './components/MyMap'
import Filter from './components/Filter'
import GrillList from './components/GrillList'

// Import utilities for searching and sort results
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';
import MediaQuery from 'react-responsive';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';

// Import error images
import UdacityIcon from './assets/udacity.png'
import HeartIcon from './assets/heart.png'
import ReactIcon from './assets/React-icon.png'

window.gm_authFailure = () => {
  const mapContainer = document.querySelector('.map-container');
  mapContainer.innerHTML = '';
  mapContainer.innerHTML = `<div class='error-message'><h2 class='error-title'><span class='red-brackets'>{</span> ERROR <span class='red-brackets'>}</span></h2><p>Google Maps failed to load properly because an authorization problem.Check your browser console for more informations and how solve the problem. You can try also to refresh the page.<p></div>`;
}

class App extends Component {

  markers = [];

  state = {
    // Default map's values
    center: { lat: 61.485723, lng: 23.777049 },
    zoom: 12,

    // To add toggle class to aside component
    toggled: false,

    // Parameters to set active marker and show InfoWindow on map component
    activeMarker: {},
    selectedPlace: {},
    showingInfoWindow: false,

    // Array with all fetched grills
    grillList: [],
    // Query and result array used by filter component
    query: '',
    foundGrills: []

  }

  componentDidMount() {
    this.getGrillList()
    if ( window.screen.width > 600) {
      this.setState({ toggled: true })
    }
  }

  /*
  ** Get the grills in the Tampere's area (radius 6 Km) and fill the arrays
  ** in state. Manage errors and fill automatically some fields if they are
  ** not into the original .json (ex. formatted address)
  */
  getGrillList() {
    fetch('https://api.foursquare.com/v2/venues/search?near=Tampere&query=grilli+nakki&category=4bf58dd8d48988d16f941735&limit=100&radius=6000&intent=browse&client_id=AH0LNWX5SVA53WN4Q5MIJAKJSUTD3VM1S4CZ0ANQA00N3H2K&client_secret=SSZDJ3TRBDHE0RH1F2CNAHNY03WTI0TAZRCHCVA2PCT2S1EL&v=20180101&locale=en')
    .then(res => res.json())
    .then(data => {
      const grillList = data.response.venues
      if (grillList.length === 0) { // in case of no results
        window.alert('Error! No available places. Try to refresh the page')
      }
      grillList.sort(sortBy('name')) // sort grills by name
      grillList.forEach((grill) => { // fill missing fields
        if (!grill.location.address) {
          grill.location.address = "No address available"
          grill.location.formattedAddress.unshift("No address available")
        }
        if (grill.categories.length === 0) { // fill missing fields
          const noCategory = { shortName: 'Other Grill'}
          grill.categories.push(noCategory)
        }
        if (grill.categories[0].shortName === 'Hot Dogs') {
          grill.categories[0].logoImage = '/hotdog_solid.png'
        } else if (grill.categories[0].shortName === 'Burgers') {
          grill.categories[0].logoImage = '/burger-and-soda.png'
        } else if (grill.categories[0].shortName === 'Fast Food' || grill.categories[0].shortName === 'Snacks'|| grill.categories[0].shortName === 'Other Grill') {
          grill.categories[0].logoImage = '/coffee_takeaway_solid.png'
        } else if (grill.categories[0].shortName === 'Vietnamese' || grill.categories[0].shortName === 'Chinese') {
          grill.categories[0].logoImage = '/noodles.png'
        } else if (grill.categories[0].shortName === 'Food Truck') {
          grill.categories[0].logoImage = '/food_truck.png'
        } else if (grill.categories[0].shortName === 'Pizza') {
          grill.categories[0].logoImage = '/pizzaicon.png'
        } else if (grill.categories[0].shortName === 'Restaurant' || grill.categories[0].shortName === 'Steakhouse') {
          grill.categories[0].logoImage = '/fork.png'
        } else if (grill.categories[0].shortName === 'Other Outdoors' || grill.categories[0].shortName === 'Convenience Store' || grill.categories[0].shortName === 'Neighborhood' || grill.categories[0].shortName === 'Playground' || grill.categories[0].shortName === 'Apparel' || grill.categories[0].shortName ==='Residential' || grill.categories[0].shortName === 'Campground') {
          grill.categories[0].logoImage = '/business.png'
        }
      })
      const foundGrills = grillList
      this.setState({ grillList, foundGrills }) // set array to loop in
      //console.log(grillList)
    })
    .catch(err => { // Manage error retrieving data from the web
      const mapContainer = document.querySelector('.map-container');
      mapContainer.innerHTML = `<div class='error-message'><h2 class='error-title'><span class='red-brackets'>{</span> ERROR <span class='red-brackets'>}</span></h2><p>Foursquare API failed to fetch properly data from the web.Check your browser console for more informations and how solve the problem. You can try also to refresh the page.<p></div>`;
      console.error('Warning, an error occurred trying to fetch places from Foursquare Places API', err)
    })
  }

  /*
  ** The filter component send the query, stored in a new RegExp called match.
  ** The grillList array is filtered using match and the result is stored in
  ** the foundGrills array. Then the map is centered again using the location
  ** values of the grills founded
  */
  searchGrills = (query) => {

    const { grillList } = this.state

    let foundGrills
    if (query) {
      const match = new RegExp(escapeRegExp(query), 'i')
      foundGrills = grillList.filter((grill) => match.test(grill.name))
    } else {
      foundGrills = grillList
    }
    //console.log(this.markers)
    this.setState({ foundGrills, query }, () => this.getCenterAndZoom())
  }

  /*
  ** Set new center and new zoom based on the number of markers on the map
  */
  getCenterAndZoom() {

    let objectsBounds = new window.google.maps.LatLngBounds(); // to get new bounds
    let cenLat
    let cenLng
    let center
    let zoom

    // Focus on the marker if the result is only one grill
    if (this.state.foundGrills.length === 1) {
      cenLat = this.state.foundGrills[0].location.lat
      cenLng = this.state.foundGrills[0].location.lng
      center = { lat: cenLat, lng: cenLng}
      zoom = 15
      // If there are no results, reset zoom and center as original values
    } else if (this.state.foundGrills.length === 0){
      center = { lat: 61.485362, lng: 23.777891 }
      zoom = 12
    } else {
      // if results are >1, calculate the new bounds
      Object.values(this.state.foundGrills).map((marker) => {
        let lat   = parseFloat(marker.location.lat);
        let long  = parseFloat(marker.location.lng);
        let point = new window.google.maps.LatLng(lat, long);
        objectsBounds.extend(point);
        return objectsBounds
      });
      // Calculate the new center and set the zoom
      cenLat = (objectsBounds.f.b + objectsBounds.f.f) / 2
      cenLng = (objectsBounds.b.b + objectsBounds.b.f) / 2
      center = { lat: cenLat, lng: cenLng}
      zoom = 12
    }
    this.setState({ center, zoom })
  }

  /* No need as the array is updated only at Marker creation.
  ** Currently the app does not allow adding or removing markers on the fly.
  ** Even so, then .pop() the array at Marker removal.
  ** To test checkout the log of onMarkerCreated.
  ** this.markers = [];
  */
  onMarkerCreated = (marker) => {
    //console.log(marker);
    if (marker !== null) {
      this.markers.push(marker);
    }
    //console.log('MarkersList size: ' + this.markers.length);
    //console.log(this.markers)
  }

  /*
  ** Check the  id of the list element with the id of the markers stored into
  ** the markers array created at the marker creation. If there is a match,
  ** launch a trigger to click the marker
  */
  selectGrill = (grill) => {

    for (const createdMarker of this.markers) {
      if (createdMarker.props.id === grill.id) {
        //console.log('Grill clicked, marker found with id: ' + createdMarker.props.id);
        new createdMarker.props.google.maps.event.trigger( createdMarker.marker, 'click' );
      }
    }
    if ( window.screen.width < 600) {
      this.setState({ toggled: false })
    }
    this.zoomPlace(grill.location.lat, grill.location.lng)
  }

  // Check the toggled state to show or remove the aside list container
  toggleAside = () => {
    if (this.state.toggled === true) {
      this.setState({ toggled: false })
    } else {
      this.setState({ toggled: true })
    }
  }

  /*
  ** Get the clicked marker properties as argument and set the state, then
  ** call zoomPlace function to actually zoom on ut. Set the visibility of
  ** InfoWindow as true
  */
  clickMarker = (props, marker) => {

    this.setState({
      activeMarker: marker,
      selectedPlace: props,
      showingInfoWindow: true
    })
    // Set the coordinates of the marker to zoom in
    this.zoomPlace(props.position.lat, props.position.lng)
  };

  // Get the coordinate and set new center and zoom
  zoomPlace = (focusLat, focusLng) => {
    let center = { lat: focusLat + 0.002, lng: focusLng }
    let zoom = 15
    this.setState({ center, zoom })
  }

  /*
  ** Clicking on the X on InfoWindow set no active markers and set to false the
  ** boolean responsable of  InfoWindow showing
  */
  closeInfoWindow = () => {
    this.setState({
      activeMarker: null,
      selectedPlace: {},
      showingInfoWindow: false
    });
  }

  /*
  ** As in closeInfoWindow, there are no more active markers and InfoWindow
  ** shown, plus zoom out
  */
  clickMap = () => {
    if (this.state.showingInfoWindow) {
      this.setState({
        activeMarker: null,
        selectedPlace: {},
        showingInfoWindow: false
      })
    }
    this.setState({ zoom: 12 })
  };


  render() {

    const buttonStyleHeader = {
      backgroundColor: 'white',
      position: 'absolute',
      zIndex: '1049',
      top: '10px',
      left: '10px',
      minWidth: '36px',
      height: '36px',
      padding: '0'
    };

    return (
      <div className="App">
        <header className="App-header">
          <MediaQuery query="(max-device-width: 425px)">
            <Button
              name="Toggle"
              aria-label="Toggle Side Panel"
              className="toggle-button-header"
              onClick={ this.toggleAside }
              style={ buttonStyleHeader }
              >
                <MenuIcon />
            </Button>
          </MediaQuery>
          <h1 className="App-title">Grilli Finder</h1>
        </header>
        <main className="main-map">
          <aside className={ this.state.toggled === true ? 'map-tools' : 'map-tools toggle' }>
            <Filter
              onQuery={ this.state.query }
              onSearch={ this.searchGrills }
            />
            <GrillList
              grills={ this.state.foundGrills }
              grillClick={ this.selectGrill }
            />
          </aside>
          <section className="map-container">
            <MyMap
              onMarkerClick={this.clickMarker}
              onInfoWindowClose={this.closeInfoWindow}
              onMapClicked={this.clickMap}
              onFocus={this.zoomPlace}
              onDezoom={this.getFar}
              center={this.state.center}
              zoom={this.state.zoom}
              grills={ this.state.foundGrills }
              onMarker={this.state.activeMarker}
              onVisible={this.state.showingInfoWindow}
              selectedPlace={this.state.selectedPlace}
              onToggle={ this.toggleAside }
              onMarkerCreated={this.onMarkerCreated}
            />
          </section>
        </main>
        <footer>
          <p>Made with  <img src={ HeartIcon } alt="Heart logo" className="footer-logo"></img>  and  <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer" aria-label="Link to React homepage"><img src={ ReactIcon } alt="React logo" className="footer-logo"></img></a>  for  <a href="https://eu.udacity.com/" target="_blank" rel="noopener noreferrer" aria-label="Link to Udacity homepage"><img src={ UdacityIcon } alt="Udacity logo" className="footer-logo"></img></a></p>
        </footer>

      </div>
    );
  }
}

export default App;
