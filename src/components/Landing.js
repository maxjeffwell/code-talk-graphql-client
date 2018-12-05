import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Landing extends Component {
  render() {
    return (
      <div className="landing">
        Landing Page
    <div className="about">
      <Link to ="/about" className="btn about">Learn More Here</Link>
    </div>
      </div>
        );
  }
}

export default Landing;
