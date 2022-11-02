# SACOMI | SERVICE APRES VENTE APP

### Todo

- work realtime collaboration (to revalidate data only)
- add locked and locker to data
- work on stock
- add tasks

### Prerequisites

The machine that will run this app should have installed:

- Node.js [https://nodejs.org/en/]
- Git [https://git-scm.com/downloads]
- Postgres [https://www.postgresql.org/download/] or MySQL [https://www.mysql.com/downloads/]

### Quickstart

- Clone the github repo by running the following command:
  - `git clone https://github.com/moh3a/sacomi-sav.git`
- To run the server for the first time:
  - `npm i -g yarn`;
  - `yarn`;
  - `yarn build`;
- Then start the production server:
  - `yarn start` for localhost, or `yarn start:local` for the local network;
- App uses Postgres by default, to change the datasource, go to `prisma/schema.prisma` and change the provider along with the URI in the .env file;

### Issues

- In case server won't start in production mode, try running this command `npm install -g win-node-env`;
