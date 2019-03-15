var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// based on https://github.com/ErrorPro/react-google-autocomplete
/* eslint-disable no-undef */
import React from 'react';
import PropTypes from 'prop-types';
import Input from './Input.js';

var ReactGoogleAutocomplete = function (_React$Component) {
  _inherits(ReactGoogleAutocomplete, _React$Component);

  function ReactGoogleAutocomplete(props) {
    _classCallCheck(this, ReactGoogleAutocomplete);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.onChange = function (val) {
      _this.setState(function (prevState, props) {
        return {
          value: _this.state.resetValue
        };
      });

      if (val.trim().length < 1) {
        if (_this.props.onClear) {
          _this.props.onClear();
        }
      }
    };

    _this.autocomplete = null;
    _this.state = {
      value: props.defaultValue || '',
      disabled: props.disabled,
      required: props.required || false,
      resetValue: ''
    };
    return _this;
  }

  ReactGoogleAutocomplete.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    var _props = this.props,
        _props$types = _props.types,
        types = _props$types === undefined ? ['(cities)'] : _props$types,
        componentRestrictions = _props.componentRestrictions,
        bounds = _props.bounds;

    var config = {
      types: types,
      bounds: bounds
    };

    if (componentRestrictions) {
      config.componentRestrictions = componentRestrictions;
    }

    this.autocomplete = new google.maps.places.Autocomplete(document.getElementById(this.props.id), config);

    this.autocomplete.addListener('place_changed', this.onSelected.bind(this));

    if (this.props.defaultValue) {
      this.setState(function (prevState, props) {
        return {
          value: _this2.props.defaultValue
        };
      });
    }
  };

  ReactGoogleAutocomplete.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    this.setState(function (prevState, props) {
      return {
        disabled: nextProps.disabled,
        value: nextProps.defaultValue
      };
    });
  };

  ReactGoogleAutocomplete.prototype.onSelected = function onSelected() {
    var _this3 = this;

    if (this.props.onPlaceSelected) {
      this.setState(function (prevState, props) {
        return {
          value: _this3.autocomplete.getPlace().formatted_address
        };
      });
      this.props.onPlaceSelected(this.autocomplete.getPlace());
    }
  };

  ReactGoogleAutocomplete.prototype.render = function render() {
    var _props2 = this.props,
        onPlaceSelected = _props2.onPlaceSelected,
        types = _props2.types,
        componentRestrictions = _props2.componentRestrictions,
        bounds = _props2.bounds,
        rest = _objectWithoutProperties(_props2, ['onPlaceSelected', 'types', 'componentRestrictions', 'bounds']);

    return React.createElement(
      'div',
      null,
      React.createElement(Input, _extends({
        inputRef: this.props.id
      }, rest, {
        id: this.props.id,
        name: this.props.name,
        value: this.state.value,
        disabled: this.state.disabled,
        onChange: this.onChange,
        required: this.state.required
      }))
    );
  };

  return ReactGoogleAutocomplete;
}(React.Component);

export { ReactGoogleAutocomplete as default };
process.env.NODE_ENV !== "production" ? ReactGoogleAutocomplete.propTypes = {
  onPlaceSelected: PropTypes.func,
  types: PropTypes.array,
  componentRestrictions: PropTypes.object,
  bounds: PropTypes.object
} : void 0;


export var ReactCustomGoogleAutocomplete = function (_React$Component2) {
  _inherits(ReactCustomGoogleAutocomplete, _React$Component2);

  function ReactCustomGoogleAutocomplete(props) {
    _classCallCheck(this, ReactCustomGoogleAutocomplete);

    var _this4 = _possibleConstructorReturn(this, _React$Component2.call(this, props));

    _this4.service = new google.maps.places.AutocompleteService();
    return _this4;
  }

  ReactCustomGoogleAutocomplete.prototype.onChange = function onChange(e) {
    var _this5 = this;

    var _props$types2 = this.props.types,
        types = _props$types2 === undefined ? ['(cities)'] : _props$types2;


    if (e.target.value) {
      this.service.getPlacePredictions({ input: e.target.value, types: types }, function (predictions, status) {
        if (status === 'OK' && predictions && predictions.length > 0) {
          _this5.props.onOpen(predictions);
          // console.log(predictions);
        } else {
          _this5.props.onClose();
        }
      });
    } else {
      this.props.onClose();
    }
  };

  ReactCustomGoogleAutocomplete.prototype.componentDidMount = function componentDidMount() {
    var _this6 = this;

    if (this.props.input.value) {
      this.placeService = new google.maps.places.PlacesService(this.refs.div);
      this.placeService.getDetails({ placeId: this.props.input.value }, function (e, status) {
        if (status === 'OK') {
          _this6.refs.input.value = e.formatted_address;
        }
      });
    }
  };

  ReactCustomGoogleAutocomplete.prototype.render = function render() {
    var _this7 = this;

    return React.createElement(
      'div',
      null,
      React.cloneElement(this.props.input, _extends({}, this.props, {
        ref: 'input',
        onChange: function onChange(e) {
          _this7.onChange(e);
        }
      })),
      React.createElement('div', { ref: 'div' })
    );
  };

  return ReactCustomGoogleAutocomplete;
}(React.Component);
process.env.NODE_ENV !== "production" ? ReactCustomGoogleAutocomplete.propTypes = {
  input: PropTypes.node.isRequired,
  onOpen: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
} : void 0;