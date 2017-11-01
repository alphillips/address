import React from 'react'

import Autocomplete from './ReactGoogleAutocomplete.js'
// import {ReactCustomGoogleAutocomplete} from 'react-google-autocomplete'
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
        country: '',
        enterManually:false,
        enterMauallyText:'Enter address manually',
        suburbOnly:props.type === 'suburb',
        defaultValue: '',
        localOnly: (props.country && props.country.toLowerCase()==="au") || false
      }

      this.australia = "Australia"
      this.alwaysDisabled = true
      // the version in google search textfield
      this.address = {}

      this.id = '_' + Math.random().toString(36).substr(2, 9)

      this.autoCompleteStyle = {
        maxWidth: props.maxWidth || "100%"
      }

      this.linkStyle = {
        display: "inline-block",
        marginBottom:"1em"
      }
  }

  componentDidMount() {
    if(this.props.value && !this.state.suburbOnly){
      this.populateAddress(this.props.value)
    }
    if(this.props.value && this.state.suburbOnly){
      this.setState((prevState, props) => ({
        defaultValue: this.props.value
      }))
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.value && !this.state.suburbOnly){
      this.populateAddress(nextProps.value)
    }
    if(nextProps.value && this.state.suburbOnly){
      this.setState((prevState, props) => ({
        defaultValue: nextProps.value
      }))
    }
  }

  populateAddress(data){
    if(data){
      let address = ''

      if(data.addressLine1 && data.addressLine1.trim().length > 0){
        address += data.addressLine1
      }
      if(data.addressLine2 && data.addressLine2.trim().length > 0){
        address += ' ' + data.addressLine2
      }
      if(data.addressLine3 && data.addressLine3.trim().length > 0){
        address += ' ' + data.addressLine3
      }
      if(address !== ''){
        address += ', '
      }
      if(data.suburb && data.suburb.trim().length > 0){
        address += ' ' + data.suburb
      }
      if(data.state && data.state.trim().length > 0){
        address += ' ' + data.state
      }
      if(data.postcode && data.postcode.trim().length > 0){
        address += ' ' + data.postcode
      }

      if (this.props.country && this.props.country !== "") {
        data.country = this.props.country
      }

      //address += data.country
      this.setState((prevState, props) => ({
        defaultValue: address
      }))
      let countryCode = data.country
      // get the country
      let urlPrefix = (process.env.API_HOST || '') + '/api/refdata/'
      fetch(urlPrefix + 'country', { credentials: 'same-origin' }).then(
        response => {
          if (response.status === 200) {
            response.text().then(data => {
              let parsedData = JSON.parse(data)
              if(countryCode){
                let text = parsedData.find((item) =>  item.value.toLowerCase() === countryCode.toLowerCase())
                if(text.label){
                  address += ', ' + text.label
                  this.setState({
                    defaultValue: address
                  })
                }
              }
            })
          }
        }
      )

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
      line1 += address.street_number + ' '
    }
    line1 += address.route!=undefined && address.route.trim().length > 0 ? address.route  : ''
    this.address.addressLine1=line1,
    this.address.addressLine2='',
    this.address.addressLine3=''

    this.address.suburb=address.locality
    this.address.state=address.administrative_area_level_1
    this.address.postcode=address.postal_code
    this.address.country=address.country

    if(this.props.onChange){
      if(this.state.suburbOnly){
        this.props.onChange(this.address.suburb)
      } else {
        this.props.onChange(this.address)
      }
    }
  }

  handleManualAddressClick = (e) => {
    e.preventDefault()
    this.setState((prevState, props) => ({
      enterManually: !prevState.enterManually,
      enterMauallyText: (prevState.enterManually ? 'Enter address manually' : 'Close manual address')
    }))
  }

  getAddressEntryFieldText = () => {
    return document.getElementById(this.id).value
  }

  render() {

    let otherProps = {}
    if(this.props.country){
      otherProps.componentRestrictions = {}
      otherProps.componentRestrictions.country = this.props.country
    }

    return (
      <div>
        <fieldset className="address-field">

            <Autocomplete
              onPlaceSelected={this.onPlaceSelected}
              types={['geocode']}
              className="uikit-text-input uikit-text-input--block"
              style={this.autoCompleteStyle}
              defaultValue={this.state.defaultValue || ''}
              id={this.id}
              name={this.id}
              label={this.props.label || 'Address'}
              disabled = {this.state.enterManually}
              onChange = {this.onChange()}
              {...otherProps}
            />

        </fieldset>
        {!this.state.suburbOnly &&
          <a
            href="#"
            style={this.linkStyle}
            onClick={this.handleManualAddressClick}>{this.state.enterMauallyText}
          </a>
        }

        {this.state.enterManually &&
        <div>
          <Input
            label="Address line 1"
            id="address1"
            value={this.address.addressLine1}
            onChange={this.onChange('addressLine1')}
          />

          <Input
            label="Address line 2"
            id="address2"
            value={this.address.addressLine2}
            onChange={this.onChange('addressLine2')}
          />

          <Input
            label="Address line 3"
            id="address3"
            value={this.address.addressLine3}
            onChange={this.onChange('addressLine3')}
          />

          <Input
            label="Suburb"
            id="suburb"
            value={this.address.suburb}
            onChange={this.onChange('suburb')}
          />

          <Input
            label="State"
            id="state"
            value={this.address.state}
            onChange={this.onChange('state')}
          />

          <Input
            label="Postcode"
            id="postcode"
            value={this.address.postcode}
            onChange={this.onChange('postcode')}
            type="tel"
            maxWidth="100px"
          />

        {!this.state.localOnly &&
          <ReferenceDataSelector
            id="country-selector"
            label="Country"
            placeholder="Select country"
            type="country"
            onChange={this.onChange('country')}
            value={this.address.country}
          />
        }
        {this.state.localOnly &&
          <Input
            disabled={this.alwaysDisabled}
            id="country-input"
            label="Country"
            type="country"
            value={this.australia}
          />
        }

        </div>
        }

      </div>
    )
  }
}

export default Address
