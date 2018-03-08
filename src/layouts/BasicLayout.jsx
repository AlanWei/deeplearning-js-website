import React, { Component } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './basiclayout.scss';

class BasicLayout extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}

export default BasicLayout;
