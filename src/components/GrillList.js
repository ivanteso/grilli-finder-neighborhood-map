import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';

import Attribution from '../assets/attribution.png'

function GrillList(props) {

  const style = {
    backgroundColor: 'white',
    fontWeight: '400'
  }

  // Map over foundGrills array to create list elements
  return(
    <div className="grill-container">
      <ul className="grill-list">
        {props.grills.map((grill) => (
          <li key={grill.id}>
            <Button
              aria-label={ grill.name }
              role="button"
              fullWidth={true}
              variant="contained"
              id={ grill.id }
              className='grill-button'
              onClick={() => props.grillClick(grill)}
              style={ style }>
                {grill.name}
            </Button>
          </li>
        ))}
      </ul>
      <img src={ Attribution } alt="Search provided by Foursquare" className="attribution"></img>
    </div>
  )

}

GrillList.propTypes = {
  grills: PropTypes.array.isRequired,
  grillClick: PropTypes.func.isRequired
}

export default GrillList
