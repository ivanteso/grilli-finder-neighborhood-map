# Grilli Finder (Neighborhood Map React), a Udacity's project

This project is part of the __Frontend Web Developer Nanodegree (full Google scholarship)__. This project's purpose is to build a single page web application from scratch using ReactJS and to add features provided by external APIs (like Maps Javascript API and FourSquare Places APi), focusing on components, props and state.

The app show all the grills and fast foods in Tampere, Finland. This app is my way help hungry and lost youngsters from Tampere finding the closest midnight snack around them.

## Table of Contents

* [Application Features](#application)
* [Instructions](#instructions)
* [Installation](#installation)
* [Live Version](#live)
* [Functionality](#functionality)
* [Requirements](#requirements)
* [Dependencies](#dependencies)
* [Contributing](#contributing)

## Application Features

Grilli Finder is fully responsive to optimize the design for every viewport size. The application is screen reader friendly and has an accessibily audit result provided by [Lighthouse](https://developers.google.com/web/tools/lighthouse/) of 95%. The service worker provided render the app's beautiful UI even in offline mode or slow network conditions.

## Instructions

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find more information on how to perform common tasks [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Installation

You can clone this repository or download it as a .zip file.
Once downloaded, you need to run `npm install` and then `npm start` in your console.
`Create React App` provide a full working service worker. To show it in action you must run the application in `production build mode`. To do that, run `npm run build` to create a buil version of the app and then `serve -s buid` to serve the production build in localhost.

## Live Version

You can find a live version of the project [here](https://ivanteso.github.io/my-neighborhood-map/). Enjoy!

## Requirements

You can find the full list of the project reuirements visiting [Udacity's Project Rubric Link](https://review.udacity.com/#!/rubrics/1351/view).

## Dependencies

The project is created from scratch running [`create-react-app`](https://github.com/facebook/create-react-app).

I've used the following dependencies and resources to buil the final version of this app:

__React Packages__
- [`google-maps-react`](https://www.npmjs.com/package/google-maps-react). A declarative Google Map React component using React, lazy-loading dependencies, current-location finder and a test-driven approach by the Fullstack React team.
- [`escape-string-regexp`](https://www.npmjs.com/package/escape-string-regexp). Escape RegExp special characters.
- [`sort-by`](https://www.npmjs.com/package/sort-by). A utility to create comparator functions for the native Array.sort() in both node and the browser. Allows for sorting by multiple properties.
- [`react-responsive`](https://www.npmjs.com/package/react-responsive). A useful package to manage mediaqueries straight into React components
- [`Prop Types`](https://www.npmjs.com/package/prop-types). Runtime type checking for React props and similar objects.
- [`@material-ui`](https://material-ui.com/). React components that implement Google's Material Design.
- [`@material-ui-icons`](https://www.npmjs.com/package/@material-ui/icons). This package provides the Google Material icons packaged as a set of React components.

__API__
- [Google Maps API](https://cloud.google.com/maps-platform/). Probably the most popular map on the web!
- [Foursquare Place API](https://developer.foursquare.com/). Over 125,000 developers building location-aware experiences with Foursquare technology and data.

__Icons__
- The icons shown on into the markers infobox are taken from the [Flaticon](https://www.flaticon.com/) free database.

## Contributing

All suggestions and tips will be more than appreciated but, as general rule, no pull requested are normally accepted.
