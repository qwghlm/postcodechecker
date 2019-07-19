const express = require("express");
const graphqlHTTP = require("express-graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLSchema,
} = require("graphql");

// TODO Split this up into bits

// Database setup
require("dotenv").config();
const pgp = require("pg-promise")();

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const database = process.env.DB_DATABASE;

const connection = `postgres://${username}:${password}@${host}:${port}/${database}`;
const db = { conn: pgp(connection) };

// Webserver setup
const app = express();

const PostcodeType = new GraphQLObjectType({
  name: "Postcode",
  type: "Query",
  fields: {
    postcode: { type: GraphQLString },
    latitude: { type: GraphQLFloat },
    longitude: { type: GraphQLFloat },
  },
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    postcode: {
      type: PostcodeType,
      args: {
        id: {
          type: GraphQLString,
        },
      },

      // TODO SQL injection?
      // TODO What happens with no result?
      resolve(parentValue, args) {
        const id = args.id.toUpperCase().replace(/\s/, "");
        const query = `SELECT * FROM postcodes WHERE id='${id}'`;
        return db.conn.one(query).then((data) => data);
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

// TODO What does this do? Is it needed?
const root = { postcode: () => "Please specify a search" };

app.post(
  "/api",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // TODO What does this do?
  })
);

app.listen(9000);
