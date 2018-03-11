import React, { Component } from 'react';
import urlMatcher from '../hoc/urlMatcher';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './basiclayout.scss';

const HeaderContainer = urlMatcher(Header);

class BasicLayout extends Component {
  render() {
    return (
      <div className="app">
        <HeaderContainer />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}

export default BasicLayout;
