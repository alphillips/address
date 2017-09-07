import React from 'react'

import Autocomplete from 'react-google-autocomplete'
import Input from '@react-ag-components/input'
// import Input from './../../components/Input'
import ReferenceDataSelector from '@react-ag-components/reference-data-selector'
// import ReferenceDataSelector from './../../components/RefDataSelector'

import './ui-kit.css'
import './styles.css'

class Address extends React.Component {

  constructor(props) {
      super(props)

      this.state = {
        addressLine1:'',
        addressLine2:'',
        addressLine3:'',
        city:'',
        state:'',
        postcode:'',
        country:'',
        enterManually:false,
        enterMauallyText:'Enter address manually'
      }
      this.address = {}

      this.autoCompleteStyle = {
        maxWidth: props.maxWidth || "100%"
      }

      this.linkStyle = {
        display: "inline-block",
        marginBottom:"1em"
      }

  }

  componentDidMount() {
    if(this.props.value){
      this.populateAddress(this.props.value)
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.value){
      this.populateAddress(nextProps.value)
    }
  }

  populateAddress(data){
    if(data){
      this.setState((prevState, props) => ({
        enterManually: true,
        enterMauallyText: 'Close manual address',
        addressLine1:data.addressLine1,
        addressLine2:data.addressLine2,
        addressLine3:data.addressLine3,
        city:data.city,
        state:data.state,
        postcode:data.postcode,
        country:data.country
      }))
      this.address = data
    }
  }

  onChange = (field) => {
    return (value) => {
      this.setState((prevState, props) => ({
        [field]: value
      }))
      this.address[field] = value
      if(this.props.onChange){
        this.props.onChange(this.address)
      }
    }
  }

  onPlaceSelected = (places) => {
    let address = {}
    for (var i = 0; i < places.address_components.length; i++) {
      var addressType = places.address_components[i].types[0];
      address[addressType] = places.address_components[i].short_name
    }


    let line1 = ''
    if(address.subpremise){
      line1 += address.subpremise + '/'
    }
    if(address.street_number){
      line1 += address.street_number
    }
    line1 += ' ' + address.route
    this.address.addressLine1=line1,
    this.address.addressLine2='',
    this.address.addressLine3=''

    this.address.city=address.locality
    this.address.state=address.administrative_area_level_1
    this.address.postcode=address.postal_code
    this.address.country=address.country

    if(this.props.onChange){
      this.props.onChange(this.address)
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

    let componentRestrictions = {}

    if(this.props.country){
      componentRestrictions.country = this.props.country
    }

    return (
      <div>
        <fieldset className="address-field">
          <legend>{this.props.label || 'Address'}</legend>

            <Autocomplete
              onPlaceSelected={this.onPlaceSelected}
              types={['geocode']}
              className="uikit-text-input uikit-text-input--block"
              style={this.autoCompleteStyle}
              placeholder="Enter address"
              componentRestrictions={componentRestrictions}
            />

        </fieldset>
        <a
          href="#"
          style={this.linkStyle}
          onClick={this.handleManualAddressClick}>{this.state.enterMauallyText}
        </a>

        {this.state.enterManually &&
        <div>
          <Input
            label="Address line 1"
            id="address1"
            value={this.state.addressLine1}
            onChange={this.onChange('addressLine1')}
          />

          <Input
            label="Address line 2"
            id="address2"
            value={this.state.addressLine2}
            onChange={this.onChange('addressLine2')}
          />

          <Input
            label="Address line 3"
            id="address3"
            value={this.state.addressLine3}
            onChange={this.onChange('addressLine3')}
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

          <ReferenceDataSelector
            id="country-selector"
            label="Country"
            placeholder="Select country"
            type="country"
            onChange={this.onChange('country')}
            value={this.state.country}
          />

        </div>
        }

      </div>
    )
  }
}

export default Address
