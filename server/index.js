const { db } = require("./db");
const { ApolloServer, gql } = require('apollo-server');
const DataLoader = require('dataloader');

const placesQuery = `SELECT *, (
    SELECT ARRAY(SELECT results.id FROM results WHERE results.place_id = places.id AND results.election_id = ANY(election_ids)) AS result_ids
  )
  FROM (
    SELECT *, (
      SELECT ARRAY(SELECT elections.id FROM elections WHERE elections.type = places.type) AS election_ids
    )
    FROM places
  ) AS places`;

const electionsQuery = `SELECT * FROM elections WHERE elections.id IN ($1:csv)`;
const resultsQuery = `SELECT * FROM results WHERE results.id IN ($1:csv)`;

const electionsLoader = new DataLoader(keys => {
  return db.conn
    .any(electionsQuery, [keys])
    .then((data) => {
      const lookup = data.reduce((acc, val) => ({...acc, [val.id]: val}), {});
      return keys.map(id => (id in lookup) ? lookup[id] : null);
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
});

const resultsLoader = new DataLoader(keys => {
  return db.conn
    .any(resultsQuery, [keys])
    .then((data) => {
      const lookup = data.reduce((acc, val) => ({...acc, [val.id]: val}), {});
      return keys.map(id => (id in lookup) ? lookup[id] : null);
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
});


const typeDefs = gql`

  type Result {
    party: String
    surname: String
    first_name: String
    votes: Int
  }

  type Election {
    date: String
    name: String
    results: [Result]
  }

  type Place {
    id: String
    name: String
    type: String
    elections: [Election]
  }

  type Query {
    place(id: String): [Place]
  }
`;



const resolvers = {
  Query: {
    place: (parent, args, context, info) => {
      const { id } = args;
      let query = placesQuery
      let params = [];
      if (id !== undefined) {
        query += " WHERE places.id=$1";
        params = [id.toUpperCase().replace(/\s/, "")]
      }
      return db.conn
        .any(query, params)
        .then((data) => data)
        .catch((error) => {
          console.error(error);
          return null;
        });
    },
  },
  Place: {
    elections: (parent, args, context, info) => {
      const { election_ids, result_ids } = parent;
      return election_ids.map(electionID => electionsLoader.load(electionID))
        .map(item => item.then(data => ({...data, result_ids})));
    }
  },
  Election: {
    results: (parent, args, context, info) => {
      const { result_ids } = parent;
      return result_ids.map(resultID => resultsLoader.load(resultID))
    }
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen(9000).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
