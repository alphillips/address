import React from 'react'
import {render} from 'react-dom'

import Component from '../../src'

class Demo extends React.Component {

  constructor(props) {
      super(props)

      this.state = {
        unit:'',
        line1:'',
        line2:'',
        line3:'',
        city:'',
        state:'',
        postcode:'',
        country:''
      }
      this.address = {}
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
      </div>
    )
  }
}


render(<Demo/>, document.querySelector('#demo'))
