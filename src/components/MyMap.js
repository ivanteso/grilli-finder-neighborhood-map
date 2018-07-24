/* eslint-disable import/first */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import MediaQuery from 'react-responsive';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';

import MapStyles from "./MapStyles.json"; // Custom style sheet

export class MyMap extends Component {


  render() {

    const buttonStyleMap = {
      backgroundColor: 'white',
      position: 'absolute',
      zIndex: '1049',
      top: '80px',
      left: '10px',
      minWidth: '40px',
      height: '40px',
      padding: '8px'
    };

    // Replace standard marker icon with an external one
    const customIcon = {
        url: 'https://image.ibb.co/ihoFjJ/maps_and_flags.png',
        scaledSize: new this.props.google.maps.Size(20, 20), // scaled size
    };

    /*
    ** Almost all the values and methods are sent to the main app component
    ** mainly to use them also with other components (ex. clicking on list
    ** element zoom on the marker) but also to have stateless component as the
    ** guidelines recommends
    */
    return (
      <section className='map' tabIndex='0'>
        <MediaQuery query="(min-device-width: 426px)">
          <Button
            name="Toggle"
            aria-label="Toggle Side Panel"
            className="toggle-button-map"
            onClick={ this.props.onToggle }
            style={ buttonStyleMap }
            >
              <MenuIcon />
          </Button>
        </MediaQuery>
        <Map
          google={this.props.google}
          onClick={this.props.onMapClicked}
          styles={ MapStyles }
          initialCenter={ this.props.center }
          initialZoom={ this.props.zoom }
          center={ this.props.center }
          zoom={ this.props.zoom }
          aria
        >
            { // map over the foundGrills array to dinamically create the markers
              // based on the search results
              this.props.grills.map((grill) => (
              <Marker
                key={ grill.id }
                id={ grill.id }
                icon={ customIcon }
                tabIndex='0'
                aria-label={`Marker for ${ grill.name }`}
                onClick={(props, marker) => this.props.onMarkerClick(props, marker)}
                name={ grill.name }
                categoryIcon={ grill.categories[0].logoImage}
                street={ grill.location.formattedAddress[0] }
                city={ grill.location.formattedAddress[1] }
                category= { grill.categories[0].shortName }
                position={{ lat: grill.location.lat, lng: grill.location.lng }}
                ref={this.props.onMarkerCreated}
                animation={ // show the animation if the marker is clicked
                            (this.props.selectedPlace.name === grill.name)
                            && this.props.google.maps.Animation.BOUNCE}
              />
            ))}
            <InfoWindow
              marker={this.props.onMarker}
              onClose={this.props.onInfoWindowClose}
              visible={this.props.onVisible}
              aria-label="Infobox for marker">
              <Card
                className="infobox-card"
                style={{ maxWidth: '250px'}}>
                <CardContent style={{ padding: '0'}}>
                  <Typography
                    variant = 'title'
                    component = 'h4'
                    style={{ maxWidth: '200px'}}
                  >
                    { this.props.selectedPlace.name }
                  </Typography>
                  <Typography
                    variant = 'subheading'
                    component = 'p'
                  >
                    { this.props.selectedPlace.category }
                  </Typography>
                  <img
                    src={process.env.PUBLIC_URL + this.props.selectedPlace.categoryIcon}
                    style={{ maxWidth: '40px', margin: '10px 0'}}
                    alt='Category Logo'
                    className='logo'></img>
                  <Typography
                    component = 'p'
                    style={{ maxWidth: '200px'}}
                  >
                    {this.props.selectedPlace.street}<br/>
                  {this.props.selectedPlace.city}
                  </Typography>
                  <Button
                    size="small"
                    tabIndex='0'
                    role="button"
                    aria-label={`Learn more about ${ this.props.selectedPlace.name }`}
                    disableFocusRipple={false}
                    disableRipple={false}
                    style={{ margin: '10px 0'}}
                    variant="contained"
                    color='primary'
                    href={ `https://foursquare.com/explore?mode=url&near=Tampere%2C%20Finland&nearGeoId=72057594038562899&q=${ this.props.selectedPlace.name }` }
                    target="_blank">
                    more
                  </Button>
                </CardContent>
              </Card>
            </InfoWindow>
        </Map>
      </section>
    );
  }
}

MyMap.propTypes = {
  google: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
  onMapClicked: PropTypes.func.isRequired,
  center: PropTypes.object.isRequired,
  zoom: PropTypes.number.isRequired,
  grills: PropTypes.array.isRequired,
  onMarkerCreated: PropTypes.func.isRequired,
  selectedPlace: PropTypes.object.isRequired,
  onMarker: PropTypes.object,
  onInfoWindowClose: PropTypes.func.isRequired,
  onVisible: PropTypes.bool.isRequired,
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAQw1YkzZPGpgMaDiI3dDBuC33Efzwg39I'
})(MyMap)
