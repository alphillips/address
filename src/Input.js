import React from 'react'

// import './ui-kit.css'
// import './input.css'

import TextField from 'material-ui/TextField'

class Input extends React.Component {

  constructor(props) {
      super(props)

      this.id = props.id || '_' + this.props.label.toLowerCase().replace(/ /g,'')

      this.state = {
        value:props.value || '',
        errorClass: '',
        errorMessage: '',
        requiredError:false
      }

      this.linkStyle = {
        maxWidth: props.maxWidth || "100%"
      };
  }

  componentDidMount() {
    if(this.props.error){
      this.setState((prevState, props) => ({
        errorClass: 'hasError',
        errorMessage: this.props.error
      }))
    } else {
      this.setState((prevState, props) => ({
        errorClass: '',
        errorMessage: ''
      }))
    }
  }


  componentWillReceiveProps(nextProps) {
    // console.log(this.state.requiredError)
    if(nextProps.error || this.state.requiredError){
      this.setState((prevState, props) => ({
        errorClass: 'hasError',
        errorMessage: this.props.error
      }))
      if(this.state.requiredError){
        errorMessage: 'This field is required'
      }
    } else {
      this.setState((prevState, props) => ({
        errorClass: '',
        errorMessage: '',
        errorMessage: false
      }))
    }
    if(nextProps.value){
      this.setState((prevState, props) => ({
        value: nextProps.value
      }))
    }
  }

  onBlur = (e) => {
    let val = e.target.value
    if(this.props.required && val.length < 1){
      this.setState((prevState, props) => ({
        errorClass: 'hasError',
        errorMessage: 'This field is required',
        requiredError:true
      }))
    } else {
      if(!this.props.error)
      this.setState((prevState, props) => ({
        errorClass: '',
        errorMessage: '',
        requiredError:false
      }))
    }
    if(this.props.onBlur){
      this.props.onBlur(val);
    }
  }

  onChange = (e) => {
    let val = e.target.value
    // console.log(val)
    this.setState((prevState, props) => ({
      value:val
    }))
    if(this.props.onChange){
      this.props.onChange(val);
    }
  }

  onPaste = (e) => {
   e.preventDefault()
    return false
  }

  render() {
    const styles = {
      hintStyle: {
        color: '#999',
      }
    }

    return (
      <div>
      {/*
      <div className={'text-group ' + this.state.errorClass}>
        {this.props.label && <label htmlFor={this.id}>{this.props.label}</label>}
        <input
          className="uikit-text-input uikit-text-input--block"
          style={this.linkStyle}
          id={this.id}
          type={this.props.type || "text"}
          value={this.state.value}
          onBlur={this.onBlur}
          onChange={this.onChange}
          placeholder={this.props.placeholder || ""}
          required={this.props.required || false}
          disabled={this.props.disabled || false}
          min={this.props.min || ""}
          max={this.props.max || ""}
          maxlength={this.props.maxlength || ""}
          width={this.props.width || ""}
          pattern={this.props.pattern || ""}
        />
        <span role="alert" aria-live="polite" className={this.state.errorClass}>{this.state.errorMessage}</span>
      </div>
      */}
      <TextField
        value={this.state.value}
        floatingLabelText={this.props.label}
        onBlur={this.onBlur}
        onChange={this.onChange}
        onPaste={this.onPaste}
        fullWidth={true}
        floatingLabelStyle={styles.hintStyle}
        multiLine={this.props.multiLine || false}
        rows={this.props.rows || 1}
        errorText={this.state.errorMessage}
        required={this.props.required || false}
        disabled={this.props.disabled || false}
        min={this.props.min || ""}
        max={this.props.max || ""}
        maxLength={this.props.maxlength || ""}
        width={this.props.width || ""}
        pattern={this.props.pattern || null}
        id={this.props.id}
        ref={this.props.inputRef || this.id}
        placeholder=""
        className={this.props.class || ""}
        type={this.props.type || "text"}
      />

      </div>

    )
  }
}
export default Input;
