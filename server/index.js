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

const PlaceType = new GraphQLObjectType({
  name: "Place",
  type: "Query",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    type: { type: GraphQLString },
  },
});

const PostcodeType = new GraphQLObjectType({
  name: "Postcode",
  type: "Query",
  fields: {
    postcode: { type: GraphQLString },
    latitude: { type: GraphQLFloat },
    longitude: { type: GraphQLFloat },
    constituency: {
      type: PlaceType,
      resolve(parentValue, args, request) {
        const { id } = parentValue;
        const query =
          "SELECT places.* FROM postcodes__places LEFT JOIN places ON place_id = places.id WHERE postcode_id=$1 AND places.type='WPC'";
        return db.conn
          .one(query, [id])
          .then((data) => data)
          .catch((error) => {
            console.error(error);
            return null;
          });
      },
    },
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

      resolve(parentValue, args) {
        const id = args.id.toUpperCase().replace(/\s/, "");
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
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
});

app.post(
  "/api",
  graphqlHTTP({
    schema,
  })
);

app.listen(9000);
