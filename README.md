# Code Talk
> Real-time messaging and code collaboration environment

![CodeTalk](file:///home/maxjeffwell/Downloads/CodeTalk.png)

## Build Status
![React](https://img.shields.io/badge/react-16.6.0%2B-blue.svg) [![npm version](https://img.shields.io/badge/npm%20package-6.4.1-orange.svg)](https://badge.fury.io/js/npm) [![Build Status](https://travis-ci.org/maxjeffwell/code-talk-graphql-client.svg?branch=master)](https://travis-ci.org/maxjeffwell/code-talk-graphql-client) ![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg) [![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://jmaxwell-code-talk-client.herokuapp.com/)

## [Live App](https://jmaxwell-code-talk-client.herokuapp.com/)

```
Demo Accounts

Username: demo
password: demopassword

Username: demo2
password: demopassword
```

## Motivation
Code Talk is a code collaboration tool with real-time text editing and real-time messaging features. It emerged from a fascination with GraphQL subscriptions as well as from the immediate satisfaction inherent to real-time applications.

## Technology Stack
**Front End**:
* React with Apollo Client
    * Queries, Mutations, Subscriptions
* CSS styling implemented with Styled Components

**Back End** [Server GitHub Repo](https://github.com/maxjeffwell/code-talk-server)

[Explore the API here](https://jmaxwell-code-talk-server.herokuapp.com/graphql)

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
