import React, { useState } from "react";
import graphQL from "./lib/graphql";

function ElectionResult({ first_name, surname, party, votes }) {
  return <tr>
    <td>{first_name} {surname}</td>
    <td>{party}</td>
    <td>{votes}</td>
  </tr>;
}

function Election({ name, results }) {
  return <React.Fragment>
    <h6>{name}</h6>

    <table>
      <tbody>
      { results.map((result, i) => <ElectionResult key={i} {...result} />)}
      </tbody>
    </table>

  </React.Fragment>
}

function Constituency({ id, name, elections }) {
  if (id === undefined) {
    return <React.Fragment>
      <p>Sorry, we could not find any data for that constituency</p>
    </React.Fragment>
  }
  return (
    <React.Fragment>
      <h4>Information about {name}</h4>

      <p>Code: <strong>{id}</strong></p>

      { elections.map((election, i) => <Election key={i} {...election} />)}

    </React.Fragment>
  );
}

function App() {
  const [constituency, setConstituency] = useState("E14000530");
  const [constituencyData, setConstituencyData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(constituency.length === 0);

  const onChange = (e) => {
    const { value } = e.currentTarget;
    setConstituency(value);
    setDisabled(value.length === 0);
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const query = `query GetPlace($id: String!) {
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
    setLoading(true);
    graphQL(query, { id: constituency }).then((data) => {
      const { place } = data;
      if (place.length === 0) {
        setConstituencyData(null);
      }
      else {
        setConstituencyData(place[0]);
      }
      setLoading(false);
    });
  };

  return (
    <div className="App row">
      <h1>Election result checker</h1>

      <p>
        To find out more about a constituency, enter an ID below and click "Search"
      </p>

      <form action="#" className="col s12" onSubmit={onSearchSubmit}>
        <div className="input-field col s10">
          <input
            type="text"
            placeholder="Enter a constituency ID"
            name="constituency"
            value={constituency}
            onChange={onChange}
          />
        </div>
        <div className="input-field col s2">
          <button className="btn" disabled={disabled}>
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
