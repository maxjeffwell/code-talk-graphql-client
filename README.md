# Code Talk
![React](https://img.shields.io/badge/React-badge.svg?style=for-the-badge&logo=react&labelColor=393939&logoColor=30d403&color=grey&logoWidth=50)
![GraphQL](https://img.shields.io/badge/GraphQL-badge.svg?style=for-the-badge&logo=graphql&labelColor=393939&logoColor=30d403&color=grey&logoWidth=50)
> Real-time messaging and code collaboration environment

<h1 align="center"><img width=100% src=https://github.com/maxjeffwell/code-talk-graphql-client/blob/master/src/components/Images/Logo/CodeTalk_Title_Logo.png alt="Code Talk Logo"></h1>


## Build Status
![React](https://img.shields.io/badge/react-16.8.0%2B-30d403.svg?style=popout&logo=react&labelColor=30d403&logoColor=393939&color=393939&logoWidth=30) [![npm version](https://img.shields.io/badge/npm%20package-6.4.1-30d403.svg?style=popout&logo=npm&labelColor=30d403&color=393939&logoWidth=30)](https://badge.fury.io/js/npm) ![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-30d403.svg?style=popout&logo=appveyor&logoColor=393939&labelColor=30d403&color=393939&logoWidth=30) [![Live Demo](https://img.shields.io/badge/demo-online-30d403.svg?style=popout&logo=heroku&logoColor=30d403&logoWidth=30)](https://jmaxwell-code-talk-client.herokuapp.com/)

```
Demo Accounts

username: demo
password: demopassword

username: demo2
password: demopassword
```

## Motivation
Code Talk is a code collaboration tool with real-time text editing and real-time messaging features. It emerged from a fascination with GraphQL subscriptions as well as from the immediate satisfaction inherent to real-time applications.

## Screenshots

[![Code Talk Landing](https://i.gyazo.com/2c79818082923f3328d830a02e90a2e7.png)](https://gyazo.com/2c79818082923f3328d830a02e90a2e7)

[![Code Talk Room - Desktop View](https://i.gyazo.com/e9c5d834029981dabe5da31660a14fd0.png)](https://gyazo.com/e9c5d834029981dabe5da31660a14fd0)

[![Code Talk Login](https://i.gyazo.com/09e498593bdf0113793a21096ae94edb.png)](https://gyazo.com/09e498593bdf0113793a21096ae94edb)

[![Code Talk Registration](https://i.gyazo.com/0b77085d85be51cdaeaf2c985f50e6d0.png)](https://gyazo.com/0b77085d85be51cdaeaf2c985f50e6d0)

[![GraphQL Playground](https://i.gyazo.com/d6fd9aa100d384ffa77676a4de49aff7.png)](https://gyazo.com/d6fd9aa100d384ffa77676a4de49aff7)


## Technology Stack
**Front End**
* React with Apollo Client
    * Queries, Mutations, Subscriptions
* CSS styling implemented with Styled Components

**Back End**  [Server GitHub Repo](https://github.com/maxjeffwell/code-talk-graphql-server)

[Explore the API with GraphQL Playground](https://jmaxwell-code-talk-server.herokuapp.com/graphql)
```
Please note that in order to perform queries, mutations (other than the login mutation), or subscriptions using GraphQL Playground, you will have to provide an authorization token in the Playground's http headers, which can be found in the lower left corner of the Playground.
The format of the header is as follows:

{"x-token": "your token here"}

You can retrieve a token by performing a login mutation and requesting the token in the return object. Or, you can log in client-side and your token will be available in your browser's local storage.
```
* GraphQL API built using Apollo Server with Express middleware
* Security
    * JWT authentication and password hashing with bcrypt.js
* Testing
     * Integration and End-to-End testing using Mocha and Chai
* Authorization
    * Session-based protected resolvers
    * Session-based protected routes

**Data Persistence**
* PostgreSQL connected to Express via Sequelize

**Hosting / SaaS / DBaaS / CICD**
* Github
* Heroku
* Heroku Redis
* Heroku Postgres

**Optimizations**
* Cursor-based pagination
* Implementation of Facebook's DataLoader
* Redis Pub/Sub Engine supporting a horizontally scalable GraphQL subscriptions server 

## Next Steps
* Implement RedisCache as a shared cache storage backend for retrieval of data from the 
code collaboration textarea. Currently, users who join subsequent to another user's
input of text in the textarea are not able to see that prior textarea history. 

## Meta

by Jeff Maxwell [maxjeffwell@gmail.com](mailto:maxjeffwell@gmail.com) | [https://github.com/maxjeffwell](https://github.com/maxjeffwell) | [https://www.jeffmaxwell.dev](https://www.jeffmaxwell.dev)

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge&color=30d403)](https://www.gnu.org/licenses/gpl-3.0)
Distributed under the GNU GPLv3 License. See ``LICENSE`` for more information.
