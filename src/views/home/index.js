import React, { Component } from 'react';
import { Button } from 'antd';
import './style.scss';

class Home extends Component {
  render() {
    return (
      <div className="home">
        <div className="title">deeplearning-js</div>
        <div className="desc">A Deep Learning Framework in JavaScript</div>
        <div className="actions">
          <Button className="btn" href="/api" type="primary" size="large">Get Started</Button>
          <Button className="btn" href="/demo" size="large">Demos</Button>
        </div>
        <iframe
          title="Github Star"
          src="https://ghbtns.com/github-btn.html?user=AlanWei&repo=deeplearning-js&type=star&count=true&size=large"
          frameBorder="0"
          scrolling="0"
          width="160px"
          height="30px"
        />
      </div>
    );
  }
}

export default Home;
