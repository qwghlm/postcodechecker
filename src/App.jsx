import React, { useState } from "react";
import graphQL from "./lib/graphql";

const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i;

function SearchResult({ result }) {

  if (result === null) {
    return <React.Fragment>
      <h4>Sorry</h4>

      <p>No data for that postcode could be found</p>
    </React.Fragment>
  }

  const { postcode, latitude, longitude, constituency } = result;
  return (
    <React.Fragment>
      <h4>Information about {postcode}</h4>

      <p>
        Latitude: {latitude} &ndash; Longitude: {longitude}
      </p>

      <p>
        Located in the parliamentary constituency of{" "}
        <strong>{constituency.name}</strong>.
      </p>
    </React.Fragment>
  );
}

function App() {
  const [postcode, setPostcode] = useState("CB1 3QE");
  const [buttonEnabled, setButtonEnabled] = useState(true);
  const [searchResult, setSearchResult] = useState(undefined);
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
        constituency {
          id
          name
        }
      }
    }`;
    setLoading(true);
    graphQL(query, { id: postcode }).then((data) => {
      console.log(data);
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

      {searchResult !== undefined && <SearchResult result={searchResult} />}
    </div>
  );
}

export default App;
