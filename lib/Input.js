'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _TextField = require('material-ui/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import './ui-kit.css'
// import './input.css'

var Input = function (_React$Component) {
  _inherits(Input, _React$Component);

  function Input(props) {
    _classCallCheck(this, Input);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.onBlur = function (e) {
      var val = e.target.value;
      if (_this.props.required && val.length < 1) {
        _this.setState(function (prevState, props) {
          return {
            errorClass: 'hasError',
            errorMessage: 'This field is required',
            requiredError: true
          };
        });
      } else {
        if (!_this.props.error) _this.setState(function (prevState, props) {
          return {
            errorClass: '',
            errorMessage: '',
            requiredError: false
          };
        });
      }
      if (_this.props.onBlur) {
        _this.props.onBlur(val);
      }
    };

    _this.onChange = function (e) {
      var val = e.target.value;
      // console.log(val)
      _this.setState(function (prevState, props) {
        return {
          value: val
        };
      });
      if (_this.props.onChange) {
        _this.props.onChange(val);
      }
    };

    _this.id = props.id || '_' + _this.props.label.toLowerCase().replace(/ /g, '');

    _this.state = {
      value: props.value || '',
      errorClass: '',
      errorMessage: '',
      requiredError: false
    };

    _this.linkStyle = {
      maxWidth: props.maxWidth || "100%"
    };
    return _this;
  }

  Input.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    if (this.props.error) {
      this.setState(function (prevState, props) {
        return {
          errorClass: 'hasError',
          errorMessage: _this2.props.error
        };
      });
    } else {
      this.setState(function (prevState, props) {
        return {
          errorClass: '',
          errorMessage: ''
        };
      });
    }
  };

  Input.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var _this3 = this;

    // console.log(this.state.requiredError)
    if (nextProps.error || this.state.requiredError) {
      this.setState(function (prevState, props) {
        return {
          errorClass: 'hasError',
          errorMessage: _this3.props.error
        };
      });
      if (this.state.requiredError) {
        errorMessage: 'This field is required';
      }
    } else {
      this.setState(function (prevState, props) {
        var _ref;

        return _ref = {
          errorClass: '',
          errorMessage: ''
        }, _ref['errorMessage'] = false, _ref;
      });
    }
    if (nextProps.value) {
      this.setState(function (prevState, props) {
        return {
          value: nextProps.value
        };
      });
    }
  };

  Input.prototype.render = function render() {
    var styles = {
      hintStyle: {
        color: '#999'
      }
    };

    return _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_TextField2.default, {
        value: this.state.value,
        floatingLabelText: this.props.label,
        onBlur: this.onBlur,
        onChange: this.onChange,
        fullWidth: true,
        floatingLabelStyle: styles.hintStyle,
        multiLine: this.props.multiLine || false,
        rows: this.props.rows || 1,
        errorText: this.state.errorMessage,
        required: this.props.required || false,
        disabled: this.props.disabled || false,
        min: this.props.min || "",
        max: this.props.max || "",
        maxLength: this.props.maxlength || "",
        width: this.props.width || "",
        pattern: this.props.pattern || null,
        id: this.props.id,
        ref: this.props.inputRef || this.id,
        placeholder: '',
        className: this.props.class || "",
        type: this.props.type || "text"
      })
    );
  };

  return Input;
}(_react2.default.Component);

exports.default = Input;
module.exports = exports['default'];