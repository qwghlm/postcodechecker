import React, { useState } from 'react';
import graphQL from "./lib/graphql";

const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i;

function App() {

  const [postcode, setPostcode] = useState("");
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false)

  const onChange = (e) => {
    const newPostcode = e.currentTarget.value;
    setPostcode(newPostcode);
    setButtonEnabled(newPostcode.match(postcodeRegex));
  }

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const query = `query PostCode($search: String!) {
      postcode(search: $search)
    }`;
    setLoading(true);
    graphQL(query, { search: postcode })
      .then(data => {
        setResponse(data);
        setLoading(false);
      });
  }

  return (
    <div className="App row">

      <h1>Postcode checker</h1>

      <p>To find out more about a postcode, enter one below and clock "Search"</p>

      <form action="#" className="col s12" onSubmit={onSearchSubmit}>
        <div className="input-field col s10">
          <input type="text" placeholder="Enter a postcode" name="postcode"
            value={postcode} onChange={onChange} />
        </div>
        <div className="input-field col s2">
          <button className="btn" disabled={!buttonEnabled}>
            { loading ? <i class="material-icons">hourglass_empty</i> : "Search" }
          </button>
        </div>
      </form>

      { response && <React.Fragment>
        <h4>Information about {postcode}</h4>

        <p>{response.postcode}</p>
      </React.Fragment>
      }

    </div>
  );
}

export default App;
