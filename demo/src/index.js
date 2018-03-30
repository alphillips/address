import React from 'react'
import {render} from 'react-dom'

import Component from '../../src'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

class Demo extends Component {

  constructor(props) {
      super(props)

      this.state = {
        city:'Paris',
        address1:''
      }

      this.address = {
        addressLine1:'7 Honmachi',
        addressLine2:'',
        addressLine3:'',
        city:'Shibuya-ku',
        state:'Tōkyō-to',
        postcode:'151-0071',
        country:'JP'
      }

      this.city = ''
  }

  onChange = (address) => {
    console.log('got address')
    console.log(address)
  }

  onChangeAddress1 = (address) => {
    this.setState((prevState, props) => ({
      address1: address
    }))
  }

  onChangeCity = (city) => {
    this.setState((prevState, props) => ({
      city: city
    }))
  }

  handleNext = () => {
    hashHistory.push('/' )
  }

  render() {
    return (
      <MuiThemeProvider>
      <div>
        <h1>address-autocomplete Demo</h1>
        <Component
          value={this.state.address1}
          onChange={this.onChangeAddress1}
          label="Home Address"
          country="au"
          required={true}
        />

        <h2>Pre-populated address</h2>
        <Component
          value={this.address}
          onChange={this.onChange}
          />

        <h2>City only</h2>
        <Component
          value={this.state.city}
          onChange={this.onChangeCity}
          type="city"
          label="Discharge city"
          placeholder="Enter city name"
        />

      </div>
      </MuiThemeProvider>
    )
  }
}


render(<Demo/>, document.querySelector('#demo'))
