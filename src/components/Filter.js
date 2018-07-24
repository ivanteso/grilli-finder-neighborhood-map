import React from 'react';
import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

function Filter(props) {

  const style = {
    padding: '0.5em',
    maxWidth: '100%',
    backgroundColor: 'white'
  }

  // The text field send search query to the app
  return(

    <div className="filter-container">
      <FormControl aria-label="Search grill by name" style={ style }>
        <InputLabel htmlFor="input" aria-label="Grill Filter" style={ style }>Search</InputLabel>
          <Input
            className="filter"
            inputProps={{ "aria-label": "Search a grill by name" }}
            autoFocus={true}
            placeholder="Find a grill"
            value={ props.onQuery }
            onChange={ (event) => props.onSearch(event.target.value) }
          />
      </FormControl>
    </div>
  )
}

Filter.propTypes = {
  onQuery: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired
}

export default Filter
