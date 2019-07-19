# postcodechecker

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Database

Set up a Postgres database and initalise the structure with the structure in `schema.sql`.

Create a fixture file by downloading the latest copy of the ONSPD and saving it to `db/src`.

Then run `build.py`, which should build out a file to `fixtures`. Import the CSV file into the `postcodes` table to populate it.

Setup a `.env` file by copying `.env.example` to `.env` and updating with the relevant login details for the database.

Then to run the servers:

* `npm run serve` runs the backend server on port 9000
* `npm run start` runs the client app in the development mode, proxying to the backend server.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## TODO

* Code Splitting https://facebook.github.io/create-react-app/docs/code-splitting
* Analyzing the Bundle Size https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size
* Making a Progressive Web App https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app
* Advanced Configuration https://facebook.github.io/create-react-app/docs/advanced-configuration
* Deployment https://facebook.github.io/create-react-app/docs/deployment
