import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import dl from '../../dl';
import action from './action';
import logo from '../../assets/logo.svg';
import './style.scss';

const propTypes = {
  message: PropTypes.string.isRequired,
  getMessage: PropTypes.func.isRequired,
};

class Home extends Component {
  componentDidMount() {
    this.props.getMessage();
  }

  runDL = () => {
    dl(
      10,
      10,
      0.005,
      1000,
      100,
      0.000003,
    );
  }

  render() {
    return (
      <div className="home">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/views/home/index.js</code> and save to reload.
        </p>
        <button onClick={this.runDL}>DL</button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  message: state.home.message,
});

const mapDispatchToProps = {
  getMessage: action.getMessage,
};

Home.propTypes = propTypes;
export default connect(mapStateToProps, mapDispatchToProps)(Home);
