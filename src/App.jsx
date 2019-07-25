import React, { useState } from "react";
import Autosuggest from 'react-autosuggest';

import graphQL from "./lib/graphql";
import { Constituency } from "./components"

const DETAIL_QUERY = `query GetPlaces($id: String!) {
  place(id: $id) {
    id
    name
    elections {
      date
      name
      results {
        party
        surname
        first_name
        votes
      }
    }
  }
}`;

const SEARCH_QUERY = `query SearchPlace($query: String!) {
  search(query: $query) {
    id
    name
  }
}`;

function App() {

  const [suggestions, setSuggestions] = useState([]);
  const [constituency, setConstituency] = useState("");
  const [constituencyID, setConstituencyID] = useState(null);
  const [constituencyData, setConstituencyData] = useState(undefined);

  const [loading, setLoading] = useState(false);

  const onChange = (e, { newValue }) => {
    setConstituency(newValue);
    if (e.type == "change" && constituencyID !== null) {
      setConstituencyID(null)
    }
  };

  const onSuggestionSelected = (e, { suggestion }) => {
    const { id } = suggestion;
    setConstituencyID(id);
  }

  const onSuggestionsFetchRequested = ({ value }) => {
    if (value.length < 3) {
      return;
    }
    graphQL(SEARCH_QUERY, { query: value }).then((data) => {
      const { search } = data;
      setSuggestions(search);
    })
  }

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  }

  const getSuggestionValue = ({name}) => name;
  const renderSuggestion = ({name}) => <div>{name}</div>;

  const renderInputComponent = inputProps => <input
    type="text"
    placeholder="Enter a constituency name"
    name="constituency"
    {...inputProps}
  />

  const onSearchSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    graphQL(DETAIL_QUERY, { id: constituencyID }).then((data) => {
      const { place } = data;
      if (!place) {
        setConstituencyData(null);
      }
      else {
        setConstituencyData(place);
      }
      setLoading(false);
    });
  };

  return (
    <div className="App row">
      <h1>Election result checker</h1>

      <p>
        To find out more about a constituency, enter a name below, select and click "Search"
      </p>

      <form action="#" className="col s12" onSubmit={onSearchSubmit}>
        <div className="input-field col s10">

          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            onSuggestionSelected={onSuggestionSelected}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            renderInputComponent={renderInputComponent}
            inputProps={{ onChange, value: constituency }}
          />

        </div>
        <div className="input-field col s2">
          <button className="btn" disabled={constituencyID == null}>
            {loading ? (
              <i className="material-icons">hourglass_empty</i>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </form>

      {constituencyData !== undefined && <Constituency {...constituencyData} />}
    </div>
  );
}

export default App;
