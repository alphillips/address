import React from 'react'
import {render} from 'react-dom'

import Component from '../../src'

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
  }

  onChange = (address) => {
    console.log('got address')
    console.log(address)
  }

  render() {
    return (
      <div>
        <h1>address-autocomplete Demo</h1>
        <Component onChange={this.onChange}/>

        <h2>Pre-populated address</h2>
        <Component value={this.address} onChange={this.onChange}/>
      </div>
    )
  }
}


render(<Demo/>, document.querySelector('#demo'))
