const { db } = require("./db");
const { ApolloServer, gql } = require('apollo-server');

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
      let query = "SELECT * FROM places"
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
      const { type, id } = parent;
      const query = "SELECT * FROM elections WHERE elections.type=$1";
      return db.conn
        .any(query, [type])
        .then((data) => data.map(item => ({...item, placeID: id })))
        .catch((error) => {
          console.error(error);
          return [];
        });
    }
  },
  Election: {
    results: (parent, args, context, info) => {
      const { id: electionID, placeID } = parent;
      const query = "SELECT * FROM results WHERE results.election_id=$1 AND results.place_id=$2";
      return db.conn
        .any(query, [electionID, placeID])
        .then((data) => data)
        .catch((error) => {
          console.error(error);
          return [];
        });
    }
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen(9000).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
