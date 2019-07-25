const { ApolloServer, gql } = require('apollo-server');

const { db } = require("./db");
const { makeDataLoader } = require("./dataloader")

const placesQuery = `SELECT *, (
    SELECT ARRAY(SELECT results.id FROM results WHERE results.place_id = places.id AND results.election_id = ANY(election_ids)) AS result_ids
  )
  FROM (
    SELECT *, (
      SELECT ARRAY(SELECT elections.id FROM elections WHERE elections.type = places.type) AS election_ids
    )
    FROM places
  ) AS places WHERE places.id=$1`;

const searchQuery = `SELECT * FROM places WHERE name ILIKE $1 ORDER BY name`;

const electionsQuery = `SELECT * FROM elections WHERE elections.id IN ($1:csv)`;
const resultsQuery = `SELECT * FROM results WHERE results.id IN ($1:csv)`;

const electionsLoader =  makeDataLoader(electionsQuery);
const resultsLoader = makeDataLoader(resultsQuery);

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
    place(id: String): Place
    search(query: String): [Place]
  }
`;


const resolvers = {
  Query: {
    place: (parent, args, context, info) => {
      const { id } = args;
      let params = [id.toUpperCase().replace(/\s/, "")]
      return db.conn
        .one(placesQuery, params)
        .then((data) => data)
        .catch((error) => {
          console.error(error);
          return null;
        });
    },
    search: (parent, args, context, info) => {
      let { query } = args;
      query = `%${query.toLowerCase()}%`;
      return db.conn
        .any(searchQuery, [query])
        .then((data) => data)
        .catch((error) => {
          console.error(error);
          return [];
        });
    }
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
