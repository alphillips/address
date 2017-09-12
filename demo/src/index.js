import React from 'react'
import {render} from 'react-dom'

import Component from '../../src'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

class Demo extends React.Component {

  constructor(props) {
      super(props)

      this.state = {
      }

      this.address = {
        addressline1:'7 Honmachi',
        addressline2:'',
        addressline3:'',
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

  render() {
    return (
      <MuiThemeProvider>
      <div>

        <h1>address-autocomplete Demo</h1>
        <Component onChange={this.onChange}/>

        <h2>Pre-populated address</h2>
        <Component value={this.address} onChange={this.onChange}/>

        <h2>City only</h2>
        <Component
          value={this.city}
          onChange={this.onChange}
          type="city"
          label="Discharge city"
          placeholder="Enter city name"
          defaultValue="Paris"
        />

      </div>
      </MuiThemeProvider>
    )
  }
}


render(<Demo/>, document.querySelector('#demo'))
