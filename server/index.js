const { db } = require("./db");
const { ApolloServer, gql } = require('apollo-server');

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`

  type Place {
    id: String
    name: String
    type: String
  }

  type Postcode {
    postcode: String
    latitude: Float
    longitude: Float
    constituency: Place
  }

  type Query {
    postcode(id: String): Postcode
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    postcode: (parent, args, context, info) => {
      let { id } = args;
      id = id.toUpperCase().replace(/\s/, "");
      const query = "SELECT * FROM postcodes WHERE postcodes.id=$1";
      return db.conn
        .one(query, [id])
        .then((data) => data)
        .catch((error) => {
          console.error(error);
          return null;
        });
    },
  },
  Postcode: {
    constituency: (parent, args, context, info) => {
      let { id } = parent;
      const query = "SELECT places.* FROM postcodes__places LEFT JOIN places ON place_id = places.id WHERE postcode_id=$1 AND places.type='WPC'";
      return db.conn
        .one(query, [id])
        .then((data) => data)
        .catch((error) => {
          console.error(error);
          return null;
        });
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen(9000).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
