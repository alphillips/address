import React from 'react'

import Autocomplete from './ReactGoogleAutocomplete.js'
// import {ReactCustomGoogleAutocomplete} from 'react-google-autocomplete'
import Input from '@react-ag-components/input'
// import Input from './../../components/Input'
import ReferenceDataSelector from '@react-ag-components/reference-data-selector'
// import ReferenceDataSelector from './../../components/RefDataSelector'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import './ui-kit.css'
import './styles.css'

class Address extends React.Component {

  constructor(props) {
      super(props)

      this.state = {
        country: '',
        enterManually:false,
        enterMauallyText:"I can't find my address",
        suburbOnly:props.type === 'suburb',
        defaultValue: '',
        localOnly: (props.country && props.country.toUpperCase()==="AU") || false
      }

      this.australia = "Australia"
      this.alwaysDisabled = true
      // the version in google search textfield
      this.address = {}

      if(props.country){
        this.address.country = props.country.toUpperCase()
      }

      if(props.defaultCountry){
        this.address.country = props.defaultCountry.toUpperCase()
      }

      this.id = '_' + Math.random().toString(36).substr(2, 9)

      this.autoCompleteStyle = {
        maxWidth: props.maxWidth || "100%"
      }

      this.linkStyle = {
        display: "inline-block",
        marginBottom:"1em"
      }

      this.cachedCountryList = null
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

      if (data.country && data.country.trim().length > 0 && this.props.country && this.props.country !== "") {
        data.country = this.props.country.toUpperCase()
      }

      //address += data.country
      this.setState((prevState, props) => ({
        defaultValue: address
      }))
      let countryCode = data.country
      // get the country

      let urlPrefix = (process.env.API_HOST || '') + '/api/refdata/'

      if(this.props.countryUrl) {
        urlPrefix = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '') + this.props.countryUrl
      }

      if(this.cachedCountryList){
        let parsedData = this.cachedCountryList
        if(countryCode){
          let text = parsedData.find((item) =>  item.value.toUpperCase() === countryCode.toUpperCase())
          if(text.label){
            address += ', ' + text.label
            this.setState({
              defaultValue: address
            })
          }
        }
      } else {
        fetch(urlPrefix + (this.props.countryType || 'country'), { credentials: 'same-origin' }).then(
          response => {
            if (response.status === 200) {
              response.text().then(data => {
                let parsedData = JSON.parse(data)
                this.cachedCountryList = parsedData
                if(countryCode){
                  let text = parsedData.find((item) =>  item.value.toUpperCase() === countryCode.toUpperCase())
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
      }

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

  onAutocompleteClear = () => {
    if(this.state.suburbOnly){
      this.props.onChange(' ')
    } else {
      this.props.onChange({})
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
    if(!address.locality){
      if(address.neighborhood){
        this.address.suburb=address.neighborhood
      }
      if(address.administrative_area_level_2){
        this.address.suburb=address.administrative_area_level_2
      }
      if(address.administrative_area_level_3){
        this.address.suburb=address.administrative_area_level_3
      }
    }
    this.address.state=address.administrative_area_level_1
    this.address.postcode=address.postal_code
    this.address.country=address.country

    if(this.props.onChange){
      if(this.state.suburbOnly){
        let suburb = this.address.suburb
        if(!suburb){
          suburb = this.address.state
        }
        this.props.onChange(suburb, this.address.country)
      } else {
        this.props.onChange(this.address)
      }
    }
  }

  handleManualAddressClick = (e) => {
    e.preventDefault()

    // When opening "Enter address manually" after clearing address
    if(!this.state.enterManually){
      if(this.props.country && this.props.country.toUpperCase()==="AU"){
        this.address.country = 'AU'
      }

      if(this.props.defaultCountry){
        this.address.country = this.props.defaultCountry
      }
    }

    this.setState((prevState, props) => ({
      enterManually: !prevState.enterManually,
      enterMauallyText: (prevState.enterManually ? "I can't find my address" : "Find my address")
    }))

  }

  getAddressEntryFieldText = () => {
    return document.getElementById(this.id).value
  }

  handleStateSelectChange = (event, index, value) => {
    this.setState((prevState, props) => ({
      state: value
    }));
    this.address.state = value;
    if (this.props.onChange) {
      this.props.onChange(this.address);
    }
  };


  render() {

    let otherProps = {}
    if(this.props.country){
      otherProps.componentRestrictions = {}
      otherProps.componentRestrictions.country = this.props.country
    }

    const selectFieldStyle = {
      width: "100%",
      'color':'#999'
    };

    return (
      <div>
        {!this.state.enterManually &&
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
              disabled={this.state.enterManually}
              onClear={this.onAutocompleteClear}
              required={this.props.required || false}
              {...otherProps}
            />
          </fieldset>
        }
        {!this.state.suburbOnly && !this.state.enterManually &&
          <div className="address-manual-switch">
            <a
              href="#"
              style={this.linkStyle}
              onClick={this.handleManualAddressClick}>{this.state.enterMauallyText}
            </a>
          </div>
        }

        {this.state.enterManually &&
        <div>
        <h3 className="address-header">{this.props.label || 'Address'}</h3>
        {!this.state.localOnly &&
          <ReferenceDataSelector
            id="country-selector"
            label="Country"
            placeholder="Select country"
            type={this.props.countryType || 'country'}
            onChange={this.onChange('country')}
            value={this.address.country}
            url={this.props.countryUrl || null}
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

          <Input
            label="Address line 1"
            id="address1"
            value={this.address.addressLine1}
            onChange={this.onChange('addressLine1')}
            maxlength={200}
          />

          <Input
            label="Address line 2 (optional)"
            id="address2"
            value={this.address.addressLine2}
            onChange={this.onChange('addressLine2')}
            maxlength={200}
          />
        {
         // <Input
         //    label="Address line 3"
         //    id="address3"
         //    value={this.address.addressLine3}
         //    onChange={this.onChange('addressLine3')}
         //  />
       }
          <Input
            label="City"
            id="suburb"
            value={this.address.suburb}
            onChange={this.onChange('suburb')}
            maxlength={200}
          />

          <div className="uikit-grid">
            <div className="row">
              <div className="col-md-6">

                {
                  (!this.address.country || this.address.country.toUpperCase() != "AU") && (
                    <Input
                      label="State"
                      id="state"
                      value={this.address.state}
                      onChange={this.onChange("state")}
                      maxlength={200}
                    />
                  )
                }

                {
                  this.address &&
                    this.address.country &&
                    (this.address.country.toUpperCase() === "AU" ||
                      this.address.country.toUpperCase() === "AUSTRALIA") && (
                      <SelectField
                        floatingLabelText="State"
                        onChange={this.handleStateSelectChange}
                        value={this.address.state}
                        style={selectFieldStyle}
                        floatingLabelStyle={selectFieldStyle}
                        id="state"
                      >
                        <MenuItem value="ACT" primaryText="Australian Capital Territory" />
                        <MenuItem value="NSW" primaryText="New South Wales" />
                        <MenuItem value="NT" primaryText="Northern Territory" />
                        <MenuItem value="QLD" primaryText="Queensland" />
                        <MenuItem value="SA" primaryText="South Australia" />
                        <MenuItem value="TAS" primaryText="Tasmania" />
                        <MenuItem value="VIC" primaryText="Victoria" />
                        <MenuItem value="WA" primaryText="Western Australia" />
                      </SelectField>
                    )
                }

              </div>
              <div className="col-md-6">
                <Input
                  label="Postcode"
                  id="postcode"
                  value={this.address.postcode}
                  onChange={this.onChange('postcode')}
                  type="tel"
                  maxWidth="100px"
                  maxlength={10}
                />
              </div>
            </div>
          </div>
          {!this.state.suburbOnly && this.state.enterManually &&
            <div className="address-manual-switch">
              <a
                href="#"
                style={this.linkStyle}
                onClick={this.handleManualAddressClick}>{this.state.enterMauallyText}
              </a>
            </div>
          }
        </div>
        }

      </div>
    )
  }
}

export default Address
