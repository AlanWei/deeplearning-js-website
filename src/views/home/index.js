import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'antd';
import Header from '../header';
import Content from '../content';
import Footer from '../footer';
import Github from './Github';
import './index.scss';

const propTypes = {
};

class Home extends Component {
  render() {
    return (
      <div className="pageRoot">
        <Header current="home" />
        <Content>
          <div className="home">
            <div className="title">deeplearning-js</div>
            <div className="desc">A Deep Learning Framework in JavaScript</div>
            <div className="actions">
              <Button className="btn" href="/api" type="primary" size="large">Get Started</Button>
              <Button className="btn" href="/demos" size="large">Demos</Button>
            </div>
            <Github />
          </div>
        </Content>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
};

Home.propTypes = propTypes;
export default connect(mapStateToProps, mapDispatchToProps)(Home);
