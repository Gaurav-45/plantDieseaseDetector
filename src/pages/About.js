import React, { Component } from 'react';
import './About.css';

export default class Home extends Component {
  render() {
    return (
      <div className="About container">
        <h3>About</h3>
        <p>
          This is a TensorFlow.js web application where users can detect disease of a plant by using images selected locally
          or taken with their device's camera.
        </p>
      </div>
    );
  }
}
