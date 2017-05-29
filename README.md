# input

React component for Address field

## Usage

### Install
```
npm i @react-ag-components/address --save
```
### Use in your project

First you must included the google script

```
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=[Your API key]&libraries=places"></script>

```

Then import into your page or component

```
import Address from '@react-ag-components/address'
```

```

onAddressChange = (address) => {
  console.log(address)
}

<Address onChange={this.onAddressChange}/>

```

### Properties

Only has one prop `onChange` which takes a function that returns an address object that matches our PartyDS service.
```
{
  addressline1:'',
  addressline2:'',
  addressline3:'',
  city:'',
  state:'',
  postcode:'',
  country:''
}
```

## Contributing

Get the repository
```
git clone https://github.com/alphillips/address.git
```

Update dependencies
```
npm install
```

Run the project
```
npm start
```

### Deploy to npm
#### Build
`npm run build -- --copy-files`

#### Publish
`npm publish --access public`
