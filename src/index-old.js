import React from 'react'

import GoogleMapLoader from "react-google-maps-loader"
import GooglePlacesSuggest from "react-google-places-suggest"
import "react-google-places-suggest/lib/index.css"

import Input from '@react-ag-components/input'

const MY_API_KEY = "AIzaSyCe_DyNzkx2RNtTsgRFBZLhfo7RKaHLmUo" // fake

class AddressAutocomplete extends React.Component {

  constructor(props) {
      super(props)

      this.state = {
        search: "",
        selectedCoordinate: null,
        unit:'',
        line1:'',
        line2:'',
        line3:'',
        city:'',
        state:'',
        postcode:'',
        country:'',
        enterManually:false,
        enterMauallyText:'Enter address manually'
      }
      this.address = {}
  }




  handleSelectSuggest = (suggest, coordinate) => {
    //console.log(suggest)
    this.setState({search: suggest.description, selectedCoordinate: coordinate})
    //let autocompleteService = new this.props.googleMaps.places.AutocompleteService()
    //console.log(this.props.googleMaps.places.PlacesService)
    var request = {
      placeId: suggest.place_id
    };

/*
street_number: 'short_name',
        route: 'long_name', street
        locality: 'long_name', suburb
        administrative_area_level_1: 'short_name', state
        country: 'long_name',
        postal_code: 'short_name'

subpremise
street_number

*/
  let callback = (addressObject) => {

    return (place, status) => {
      console.log(place);
      console.log(status);

      if (status === 'OK') {
        console.log(place);
        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0];
          // if(addressType === 'street_number'){
          //   //this.address
          // }
          addressObject[addressType] = place.address_components[i].short_name
          console.log(place.address_components[i].short_name)
          // if (componentForm[addressType]) {
          //   var val = place.address_components[i][componentForm[addressType]];
          //   document.getElementById(addressType).value = val;
          // }
        }
      }
      console.log(addressObject)
    }
  }

    let service = new this.props.googleMaps.places.PlacesService(document.createElement('div'));
    service.getDetails(request, callback(this.address));
  }

  onSearchChange = (value) => {
    this.setState({search: value})
  }

  onBlur = (e) => {
    // let val = e.target.value
    // console.log(val)
    // if(this.props.onBlur){
    //   this.props.onBlur(val);
    // }
  }

  onChange = (field) => {
    return (value) => {
      this.setState((prevState, props) => ({
        [field]: value
      }))
    }
  }

  handleManualAddressClick = (e) => {
    e.preventDefault()
    this.setState((prevState, props) => ({
      enterManually: !prevState.enterManually,
      enterMauallyText: (prevState.enterManually ? 'Enter address manually' : 'Close manual address')
    }))
  }

  render() {
    const {search} = this.state
    const {googleMaps} = this.props

    return (
      <div>

        <Input
          label="Unit, floor, etc..."
          id="unit"
          value={this.state.unit}
          onChange={this.onChange('unit')}
          maxWidth="100px"
        />


        <GooglePlacesSuggest
          googleMaps={googleMaps}
          onSelectSuggest={this.handleSelectSuggest}
          search={search}
        >
          <Input
            label="Address"
            id="address"
            value={search}
            onChange={this.onSearchChange}
          />

        </GooglePlacesSuggest>

        <a href="#" onClick={this.handleManualAddressClick}>{this.state.enterMauallyText}</a>

        {this.state.enterManually &&
        <div>
          <Input
            label="Address line 1"
            id="address1"
            value={this.state.line1}
            onChange={this.onChange('line1')}
          />

          <Input
            label="Address line 2"
            id="address2"
            value={this.state.line2}
            onChange={this.onChange('line2')}
          />

          <Input
            label="Address line 3"
            id="address3"
            value={this.state.line3}
            onChange={this.onChange('line3')}
          />

          <Input
            label="City/Town"
            id="city"
            value={this.state.city}
            onChange={this.onChange('city')}
          />

          <Input
            label="State/Region"
            id="state"
            value={this.state.state}
            onChange={this.onChange('state')}
          />

          <Input
            label="Postcode"
            id="postcode"
            value={this.state.postcode}
            onChange={this.onChange('postcode')}
            type="tel"
            maxWidth="100px"
          />

          <Input
            label="Country"
            id="country"
            value={this.state.country}
            onChange={this.onChange('country')}
          />
        </div>
        }

      </div>
    )
  }
}

export default GoogleMapLoader(AddressAutocomplete, {
  libraries: ["places"],
  key: MY_API_KEY,
})
