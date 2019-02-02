# Code Talk
> Real-time messaging and code collaboration environment

<h1 align="center"><img width=100% src=https://github.com/maxjeffwell/code-talk-graphql-client/blob/master/src/components/Images/Logo/CodeTalk_Title_Logo.png alt="Code Talk Logo"></h1>


## Build Status
![React](https://img.shields.io/badge/react-16.6.0%2B-blue.svg) [![npm version](https://img.shields.io/badge/npm%20package-6.4.1-orange.svg)](https://badge.fury.io/js/npm) [![Build Status](https://travis-ci.org/maxjeffwell/code-talk-graphql-client.svg?branch=master)](https://travis-ci.org/maxjeffwell/code-talk-graphql-client) ![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg) [![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://jmaxwell-code-talk-client.herokuapp.com/)

## [Live App](https://jmaxwell-code-talk-client.herokuapp.com/)

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

[![Code Talk Room](https://i.gyazo.com/32c011fbe49b90f9f825bbbf20661c86.png)](https://gyazo.com/32c011fbe49b90f9f825bbbf20661c86)

[![Code Talk Landing](https://i.gyazo.com/64497e5343c6f84da745fcafb898e8bf.png)](https://gyazo.com/64497e5343c6f84da745fcafb898e8bf)

[![GraphQL Playground](https://i.gyazo.com/d6fd9aa100d384ffa77676a4de49aff7.png)](https://gyazo.com/d6fd9aa100d384ffa77676a4de49aff7)

[![Code Talk Registration](https://i.gyazo.com/a2feeaa15f0297b7c9d86f73df3dc09c.png)](https://gyazo.com/a2feeaa15f0297b7c9d86f73df3dc09c)

## Technology Stack
**Front End**
* React with Apollo Client
    * Queries, Mutations, Subscriptions
* CSS styling implemented with Styled Components

**Back End**  [Server GitHub Repo](https://github.com/maxjeffwell/code-talk-graphql-server)

[Explore the API with GraphQL Playground](https://jmaxwell-code-talk-server.herokuapp.com/graphql)

Please note that in order to perform queries, mutations (other than the login mutation), or subscriptions using GraphQL Playground, you will have to provide an authorization token in the Playground's http headers, which can be found in the lower left corner of the Playground.

The format of the header is as follows:

{"x-token": "your token here"}

You can get a token by performing a login mutation and requesting the token in the return object. Or, you can log in client-side and your token will be available in your browser's local storage.

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

**Hosting / SaaS / CICD**
* Github
* TravisCI
* Heroku
* ElephantSQL

**Optimizations**
* Cursor-based pagination
* Implementation of Facebook's dataloader

## Meta

by Jeff Maxwell maxjeffwell@gmail.com | [https://github.com/maxjeffwell](https://github.com/maxjeffwell)

Distributed under the GNU GPLv3 License. See ``LICENSE`` for more information.
