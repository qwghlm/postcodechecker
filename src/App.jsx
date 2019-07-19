import React, { useState } from "react";
import graphQL from "./lib/graphql";

const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i;

function App() {
  const [postcode, setPostcode] = useState("CB1 3QE");
  const [buttonEnabled, setButtonEnabled] = useState(true);
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const newPostcode = e.currentTarget.value;
    setPostcode(newPostcode);
    setButtonEnabled(newPostcode.match(postcodeRegex));
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const query = `query Postcode($id: String!) {
      postcode(id: $id) {
        postcode
        latitude
        longitude
      }
    }`;
    setLoading(true);
    graphQL(query, { id: postcode }).then((data) => {
      const { postcode } = data;
      setSearchResult(postcode);
      setLoading(false);
    });
  };

  return (
    <div className="App row">
      <h1>Postcode checker</h1>

      <p>
        To find out more about a postcode, enter one below and clock "Search"
      </p>

      <form action="#" className="col s12" onSubmit={onSearchSubmit}>
        <div className="input-field col s10">
          <input
            type="text"
            placeholder="Enter a postcode"
            name="postcode"
            value={postcode}
            onChange={onChange}
          />
        </div>
        <div className="input-field col s2">
          <button className="btn" disabled={!buttonEnabled}>
            {loading ? (
              <i className="material-icons">hourglass_empty</i>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </form>

      {searchResult && (
        <React.Fragment>
          <h4>Information about {searchResult.postcode}</h4>

          <p>
            Latitude: {searchResult.latitude} &ndash; Longitude:{" "}
            {searchResult.longitude}
          </p>
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
