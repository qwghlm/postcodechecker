import React from "react";

export function ElectionResult({ first_name, surname, party, votes }) {
  return <tr>
    <td>{first_name} {surname}</td>
    <td>{party}</td>
    <td>{votes}</td>
  </tr>;
}

export function Election({ name, results }) {
  return <React.Fragment>
    <h5>{name}</h5>

    <table>
      <tbody>
      { results.map((result, i) => <ElectionResult key={i} {...result} />)}
      </tbody>
    </table>

  </React.Fragment>
}

export function Constituency({ id, name, elections }) {
  if (id === undefined) {
    return <React.Fragment>
      <p>Sorry, we could not find any data for that constituency.</p>
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
