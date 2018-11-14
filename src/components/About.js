import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="about">
      <div className="about-header">
        <h1>What is Code Talk All About?</h1>
      </div>
      <div className="about-content">
        <p>
          Content Here
        </p>
      </div>
      <Link to="/" className="back">
      Return to Home Page
      </Link>
    </div>
  );
}
