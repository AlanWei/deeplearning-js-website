import React, { Component } from 'react';
import './footer.scss';

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div>Created by Alan Wei</div>
        <div className="license">Released under the MIT License</div>
      </footer>
    );
  }
}

export default Footer;
