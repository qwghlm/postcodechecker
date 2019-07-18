export default function graphQL(query, variables) {
  return fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    })
  })
  .then(response => response.json())
  .then(body => Promise.resolve(body.data))
}
