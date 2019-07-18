import React, { useState } from 'react';

const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i;

function App() {

  const [postcodeValue, setPostcodeValue] = useState("");
  const [buttonEnabled, setButtonEnabled] = useState(false);

  const onChange = (e) => {
    const postcode = e.currentTarget.value;
    setPostcodeValue(postcode);
    setButtonEnabled(postcode.match(postcodeRegex));
  }

  const onSearchSubmit = (e) => {
    e.preventDefault();
    console.log(postcodeValue);
  }

  return (
    <div className="App row">

      <h1>Postcode checker</h1>

      <p>To find out more about a postcode, enter one below and clock "Search"</p>

      <form action="#" className="col s12" onSubmit={onSearchSubmit}>
        <div className="input-field col s10">
          <input type="text" placeholder="Enter a postcode" name="postcode"
            value={postcodeValue} onChange={onChange} />
        </div>
        <div className="input-field col s2">
          <button className="btn" disabled={!buttonEnabled}>Search</button>
        </div>
      </form>
    </div>
  );
}

export default App;
