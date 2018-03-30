'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ReactGoogleAutocomplete = require('./ReactGoogleAutocomplete.js');

var _ReactGoogleAutocomplete2 = _interopRequireDefault(_ReactGoogleAutocomplete);

var _input = require('@react-ag-components/input');

var _input2 = _interopRequireDefault(_input);

var _referenceDataSelector = require('@react-ag-components/reference-data-selector');

var _referenceDataSelector2 = _interopRequireDefault(_referenceDataSelector);

var _SelectField = require('material-ui/SelectField');

var _SelectField2 = _interopRequireDefault(_SelectField);

var _MenuItem = require('material-ui/MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

require('./ui-kit.css');

require('./styles.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import {ReactCustomGoogleAutocomplete} from 'react-google-autocomplete'

// import Input from './../../components/Input'

// import ReferenceDataSelector from './../../components/RefDataSelector'


var Address = function (_React$Component) {
  _inherits(Address, _React$Component);

  function Address(props) {
    _classCallCheck(this, Address);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.onChange = function (field) {
      return function (value) {
        _this.setState(function (prevState, props) {
          var _ref;

          return _ref = {}, _ref[field] = value, _ref;
        });
        _this.address[field] = value;
        if (_this.props.onChange) {
          _this.props.onChange(_this.address);
        }
      };
    };

    _this.onAutocompleteClear = function () {
      if (_this.state.suburbOnly) {
        _this.props.onChange(' ');
      } else {
        _this.props.onChange({});
      }
    };

    _this.onPlaceSelected = function (places) {
      var address = {};
      for (var i = 0; i < places.address_components.length; i++) {
        var addressType = places.address_components[i].types[0];
        address[addressType] = places.address_components[i].short_name;
      }
      var line1 = '';
      if (address.subpremise) {
        line1 += address.subpremise + '/';
      }
      if (address.street_number) {
        line1 += address.street_number + ' ';
      }
      line1 += address.route != undefined && address.route.trim().length > 0 ? address.route : '';
      _this.address.addressLine1 = line1, _this.address.addressLine2 = '', _this.address.addressLine3 = '';

      _this.address.suburb = address.locality;
      _this.address.state = address.administrative_area_level_1;
      _this.address.postcode = address.postal_code;
      _this.address.country = address.country;

      if (_this.props.onChange) {
        if (_this.state.suburbOnly) {
          var suburb = _this.address.suburb;
          if (!suburb) {
            suburb = _this.address.state;
          }
          _this.props.onChange(suburb, _this.address.country);
        } else {
          _this.props.onChange(_this.address);
        }
      }
    };

    _this.handleManualAddressClick = function (e) {
      e.preventDefault();

      // When opening "Enter address manually" after clearing address
      if (!_this.state.enterManually) {
        if (_this.props.country && _this.props.country.toUpperCase() === "AU") {
          _this.address.country = 'AU';
        }

        if (_this.props.defaultCountry) {
          _this.address.country = _this.props.defaultCountry;
        }
      }

      _this.setState(function (prevState, props) {
        return {
          enterManually: !prevState.enterManually,
          enterMauallyText: prevState.enterManually ? "I can't find my address" : "Find my address"
        };
      });
    };

    _this.getAddressEntryFieldText = function () {
      return document.getElementById(_this.id).value;
    };

    _this.handleStateSelectChange = function (event, index, value) {
      _this.setState(function (prevState, props) {
        return {
          state: value
        };
      });
      _this.address.state = value;
      if (_this.props.onChange) {
        _this.props.onChange(_this.address);
      }
    };

    _this.state = {
      country: '',
      enterManually: false,
      enterMauallyText: "I can't find my address",
      suburbOnly: props.type === 'suburb',
      defaultValue: '',
      localOnly: props.country && props.country.toUpperCase() === "AU" || false
    };

    _this.australia = "Australia";
    _this.alwaysDisabled = true;
    // the version in google search textfield
    _this.address = {};

    if (props.country) {
      _this.address.country = props.country.toUpperCase();
    }

    if (props.defaultCountry) {
      _this.address.country = props.defaultCountry.toUpperCase();
    }

    _this.id = '_' + Math.random().toString(36).substr(2, 9);

    _this.autoCompleteStyle = {
      maxWidth: props.maxWidth || "100%"
    };

    _this.linkStyle = {
      display: "inline-block",
      marginBottom: "1em"
    };

    _this.cachedCountryList = null;
    return _this;
  }

  Address.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    if (this.props.value && !this.state.suburbOnly) {
      this.populateAddress(this.props.value);
    }
    if (this.props.value && this.state.suburbOnly) {
      this.setState(function (prevState, props) {
        return {
          defaultValue: _this2.props.value
        };
      });
    }
  };

  Address.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.value && !this.state.suburbOnly) {
      this.populateAddress(nextProps.value);
    }
    if (nextProps.value && this.state.suburbOnly) {
      this.setState(function (prevState, props) {
        return {
          defaultValue: nextProps.value
        };
      });
    }
  };

  Address.prototype.populateAddress = function populateAddress(data) {
    var _this3 = this;

    if (data) {
      var address = '';

      if (data.addressLine1 && data.addressLine1.trim().length > 0) {
        address += data.addressLine1;
      }
      if (data.addressLine2 && data.addressLine2.trim().length > 0) {
        address += ' ' + data.addressLine2;
      }
      if (data.addressLine3 && data.addressLine3.trim().length > 0) {
        address += ' ' + data.addressLine3;
      }
      if (address !== '') {
        address += ', ';
      }
      if (data.suburb && data.suburb.trim().length > 0) {
        address += ' ' + data.suburb;
      }
      if (data.state && data.state.trim().length > 0) {
        address += ' ' + data.state;
      }
      if (data.postcode && data.postcode.trim().length > 0) {
        address += ' ' + data.postcode;
      }

      if (data.country && data.country.trim().length > 0 && this.props.country && this.props.country !== "") {
        data.country = this.props.country.toUpperCase();
      }

      //address += data.country
      this.setState(function (prevState, props) {
        return {
          defaultValue: address
        };
      });
      var countryCode = data.country;
      // get the country

      var urlPrefix = (process.env.API_HOST || '') + '/api/refdata/';

      if (this.props.countryUrl) {
        urlPrefix = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + this.props.countryUrl;
      }

      if (this.cachedCountryList) {
        var parsedData = this.cachedCountryList;
        if (countryCode) {
          var text = parsedData.find(function (item) {
            return item.value.toUpperCase() === countryCode.toUpperCase();
          });
          if (text.label) {
            address += ', ' + text.label;
            this.setState({
              defaultValue: address
            });
          }
        }
      } else {
        fetch(urlPrefix + (this.props.countryType || 'country'), { credentials: 'same-origin' }).then(function (response) {
          if (response.status === 200) {
            response.text().then(function (data) {
              var parsedData = JSON.parse(data);
              _this3.cachedCountryList = parsedData;
              if (countryCode) {
                var _text = parsedData.find(function (item) {
                  return item.value.toUpperCase() === countryCode.toUpperCase();
                });
                if (_text.label) {
                  address += ', ' + _text.label;
                  _this3.setState({
                    defaultValue: address
                  });
                }
              }
            });
          }
        });
      }

      this.address = data;
    }
  };

  Address.prototype.render = function render() {

    var otherProps = {};
    if (this.props.country) {
      otherProps.componentRestrictions = {};
      otherProps.componentRestrictions.country = this.props.country;
    }

    var selectFieldStyle = {
      width: "100%",
      'color': '#999'
    };

    return _react2.default.createElement(
      'div',
      null,
      !this.state.enterManually && _react2.default.createElement(
        'fieldset',
        { className: 'address-field' },
        _react2.default.createElement(_ReactGoogleAutocomplete2.default, _extends({
          onPlaceSelected: this.onPlaceSelected,
          types: ['geocode'],
          className: 'uikit-text-input uikit-text-input--block',
          style: this.autoCompleteStyle,
          defaultValue: this.state.defaultValue || '',
          id: this.id,
          name: this.id,
          label: this.props.label || 'Address',
          disabled: this.state.enterManually,
          onClear: this.onAutocompleteClear,
          required: this.props.required || false
        }, otherProps))
      ),
      !this.state.suburbOnly && !this.state.enterManually && _react2.default.createElement(
        'div',
        { className: 'address-manual-switch' },
        _react2.default.createElement(
          'a',
          {
            href: '#',
            style: this.linkStyle,
            onClick: this.handleManualAddressClick },
          this.state.enterMauallyText
        )
      ),
      this.state.enterManually && _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'h3',
          { className: 'address-header' },
          this.props.label || 'Address'
        ),
        !this.state.localOnly && _react2.default.createElement(_referenceDataSelector2.default, {
          id: 'country-selector',
          label: 'Country',
          placeholder: 'Select country',
          type: this.props.countryType || 'country',
          onChange: this.onChange('country'),
          value: this.address.country.toUpperCase(),
          url: this.props.countryUrl || null
        }),
        this.state.localOnly && _react2.default.createElement(_input2.default, {
          disabled: this.alwaysDisabled,
          id: 'country-input',
          label: 'Country',
          type: 'country',
          value: this.australia
        }),
        _react2.default.createElement(_input2.default, {
          label: 'Address line 1',
          id: 'address1',
          value: this.address.addressLine1,
          onChange: this.onChange('addressLine1')
        }),
        _react2.default.createElement(_input2.default, {
          label: 'Address line 2 (optional)',
          id: 'address2',
          value: this.address.addressLine2,
          onChange: this.onChange('addressLine2')
        }),
        _react2.default.createElement(_input2.default, {
          label: 'Suburb',
          id: 'suburb',
          value: this.address.suburb,
          onChange: this.onChange('suburb')
        }),
        _react2.default.createElement(
          'div',
          { className: 'uikit-grid' },
          _react2.default.createElement(
            'div',
            { className: 'row' },
            _react2.default.createElement(
              'div',
              { className: 'col-md-6' },
              (!this.address.country || this.address.country.toUpperCase() != "AU") && _react2.default.createElement(_input2.default, {
                label: 'State',
                id: 'state',
                value: this.address.state,
                onChange: this.onChange("state")
              }),
              this.address && this.address.country && (this.address.country.toUpperCase() === "AU" || this.address.country.toUpperCase() === "AUSTRALIA") && _react2.default.createElement(
                _SelectField2.default,
                {
                  floatingLabelText: 'State',
                  onChange: this.handleStateSelectChange,
                  value: this.address.state,
                  style: selectFieldStyle,
                  floatingLabelStyle: selectFieldStyle,
                  id: 'state'
                },
                _react2.default.createElement(_MenuItem2.default, { value: 'ACT', primaryText: 'Australian Capital Territory' }),
                _react2.default.createElement(_MenuItem2.default, { value: 'NSW', primaryText: 'New South Wales' }),
                _react2.default.createElement(_MenuItem2.default, { value: 'NT', primaryText: 'Northern Territory' }),
                _react2.default.createElement(_MenuItem2.default, { value: 'QLD', primaryText: 'Queensland' }),
                _react2.default.createElement(_MenuItem2.default, { value: 'SA', primaryText: 'South Australia' }),
                _react2.default.createElement(_MenuItem2.default, { value: 'TAS', primaryText: 'Tasmania' }),
                _react2.default.createElement(_MenuItem2.default, { value: 'VIC', primaryText: 'Victoria' }),
                _react2.default.createElement(_MenuItem2.default, { value: 'WA', primaryText: 'Western Australia' })
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'col-md-6' },
              _react2.default.createElement(_input2.default, {
                label: 'Postcode',
                id: 'postcode',
                value: this.address.postcode,
                onChange: this.onChange('postcode'),
                type: 'tel',
                maxWidth: '100px'
              })
            )
          )
        ),
        !this.state.suburbOnly && this.state.enterManually && _react2.default.createElement(
          'div',
          { className: 'address-manual-switch' },
          _react2.default.createElement(
            'a',
            {
              href: '#',
              style: this.linkStyle,
              onClick: this.handleManualAddressClick },
            this.state.enterMauallyText
          )
        )
      )
    );
  };

  return Address;
}(_react2.default.Component);

exports.default = Address;
module.exports = exports['default'];