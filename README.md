# Code Talk
> Real-time messaging and code collaboration environment

![CodeTalk](file:///home/maxjeffwell/Downloads/CodeTalk.png)

## Build Status
[![Build Status](https://travis-ci.org/maxjeffwell/code-talk-graphql-client.svg?branch=master)](https://travis-ci.org/maxjeffwell/code-talk-graphql-client)

## [Live App](https://jmaxwell-code-talk-client.herokuapp.com/)
Demo Accounts:

&nbsp; **demo** &nbsp; / &nbsp; **demopassword**

&nbsp; **demo2** &nbsp; / &nbsp; **demopassword** &nbsp;

## Motivation
Code Talk is a code collaboration tool with real-time text editing and real-time messaging features. It emerged from a fascination with GraphQL subscriptions as well as from the immediate satisfaction inherent to real-time applications.

## Technology Stack
**Front End**:
* React with Apollo Client
    * Queries, Mutations, Subscriptions
* CSS styling implemented with Styled Components

**Back End** ([Server GitHub Repo](https://jmaxwell-code-talk-server.herokuapp.com/graphql))

* Node.js with Express and Apollo Server
* Security
    * JWT authentication and password hashing with bcrypt.js
* Testing
     * Integration and End-to-End testing using Mocha and Chai
* Authorization
    * Session-based protected resolvers
    * Session-based protected routes

**Database**
* PostgreSQL connected to Express via Sequelize ORM

**CICD**
* Mocha, Chai
* TravisCI
* Heroku

**Optimizations**
* Cursor-based pagination
* Implementation of Facebook's dataloader
