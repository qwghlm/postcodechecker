import React, { Component } from 'react';

const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i;

class App extends Component {

  state = {
    postcodeValue: "",
    buttonEnabled: false,
  }

  onChange = (e) => {
    this.setState({
      postcodeValue: e.currentTarget.value,
      buttonEnabled: e.currentTarget.value.match(postcodeRegex),
    });
  }

  onSearchSubmit = (e) => {
    e.preventDefault();
    console.log(e);
  }

  render() {
    const { postcodeValue, buttonEnabled } = this.state;
    return (
      <div className="App row">

        <h1>Postcode checker</h1>

        <p>To find out more about a postcode, enter one below and clock "Search"</p>

        <form action="#" className="col s12" onSubmit={this.onSearchSubmit}>
          <div className="input-field col s10">
            <input type="text" placeholder="Enter a postcode" name="postcode"
              value={postcodeValue} onChange={this.onChange} />
          </div>
          <div className="input-field col s2">
            <button className="btn" disabled={!buttonEnabled}>Search</button>
          </div>
        </form>
      </div>
    );
  }
}

export default App;
