import React, { Component } from 'react';
import { Select, Card, Button, Icon, InputNumber } from 'antd';
import { Chart, Axis, Geom, Tooltip } from 'bizcharts';
import map from 'lodash/map';
import cloneDeep from 'lodash/cloneDeep';
import pullAt from 'lodash/pullAt';
import filter from 'lodash/filter';
import SiderLayout from '../../layouts/SiderLayout';
import { LEARNING_RATES, EPOCHES, IRIS_DIMS, NORMALIZATION_FUNCS } from './const';
import irisTrainSet from '../../dl/data/iris.train';
import { softmax, predict, getTrainSet, getTestSet } from '../../dl/softmax';
import './demo.scss';

const { Option } = Select;

const SIDER_ITEMS = [{
  key: 'logistic',
  link: '/demo',
  text: 'Logistic regression',
}, {
  key: 'softmax',
  link: '/demo/softmax',
  text: 'Softmax classifier',
}];

class Softmax extends Component {
  state = {
    learningRate: 0.003,
    epoch: 500,
    costFunc: 'cross-entropy',
    normalizationFunc: 'zscore',
    //
    hiddenLayers: [],
    currentHoverHiddenLayerIndex: -1,
    //
    isTraining: false,
    currentEpoch: 0,
    //
    trainSetResult: {
      totalCount: 0,
      correct: [],
      setosa: [],
      versicolor: [],
      virginica: [],
    },
    testSetResult: {
      totalCount: 0,
      correct: [],
      setosa: [],
      versicolor: [],
      virginica: [],
    },
    costs: [],
  }

  handleAddLayer = () => {
    const layers = cloneDeep(this.state.hiddenLayers);
    layers.push({
      size: 10,
      activationFunc: 'relu',
    });
    this.setState({
      hiddenLayers: layers,
    });
  }

  handleMouseEnterHiddenLayer = (idx) => {
    this.setState({
      currentHoverHiddenLayerIndex: idx,
    });
  }

  handleDeleteHiddenLayer = (idx) => {
    const layers = cloneDeep(this.state.hiddenLayers);
    pullAt(layers, idx);
    this.setState({
      hiddenLayers: layers,
    });
  }

  handleChangeHiddenLayerSize = (size, idx) => {
    const layers = cloneDeep(this.state.hiddenLayers);
    layers[idx].size = size;
    this.setState({
      hiddenLayers: layers,
    });
  }

  updateInProgress = (ro, idx) => {
    this.setState({
      currentEpoch: idx,
      costs: filter(map(ro.costs, (cost, i) => ({
        epoch: i + 1,
        cost,
      })), (obj, i) => ((i + 1) % 10 === 0)),
    });
  }

  handleTrainEnd = (ro) => {
    this.setState({
      isTraining: false,
    });
    const trainSet = getTrainSet();
    const testSet = getTestSet();
    const trainSetResult = predict(trainSet.input, trainSet.output, ro.parameters, 35);
    const testSetResult = predict(testSet.input, testSet.output, ro.parameters, 15);
    this.setState({
      trainSetResult,
      testSetResult,
      costs: filter(map(ro.costs, (cost, idx) => ({
        epoch: idx + 1,
        cost,
      })), (obj, i) => ((i + 1) % 10 === 0)),
    });
  }

  handleTrainingStart = () => {
    this.setState({
      isTraining: true,
    });
    softmax(
      this.state.hiddenLayers,
      this.state.learningRate,
      this.state.epoch,
      this.updateInProgress,
      this.handleTrainEnd,
    );
  }

  handleSelectChange = (value, type) => {
    this.setState({
      [type]: value,
    });
  }

  handleResetModel = () => {
    this.setState({
      learningRate: 0.003,
      epoch: 500,
      costFunc: 'cross-entropy',
      normalizationFunc: 'zscore',
      //
      hiddenLayers: [],
      currentHoverHiddenLayerIndex: -1,
      //
      isTraining: false,
      currentEpoch: 0,
    });
  }

  renderControlPanel = () => (
    <div className="controlPanel">
      <Icon
        className="resetBtn"
        type="reload"
        onClick={this.handleResetModel}
      />
      <div
        className="startBtn controlPanelItem"
        role="presentation"
        onClick={this.handleTrainingStart}
      >
        {this.state.isTraining ?
          <Icon type="loading" />
          :
          <Icon type="caret-right" />
        }
      </div>
      <div className="controlPanelItem">
        <div className="selectLabel"><strong>Dataset</strong></div>
        <Select defaultValue="iris" style={{ width: 200 }} disabled>
          <Option value="iris">Iris</Option>
        </Select>
      </div>
      <div className="controlPanelItem">
        <div className="selectLabel"><strong>Epoch</strong></div>
        <div>{this.state.currentEpoch}</div>
      </div>
    </div>
  )

  renderDataPanel = () => (
    <div className="panel">
      <div className="panelHeader">DATA</div>
      <div className="panelBody">
        <div className="sectionTitle">Hyperparameters</div>
        <div className="panelItem">
          <div className="selectLabel">Learning Rate</div>
          <Select
            value={this.state.learningRate}
            style={{ width: 200 }}
            onChange={value => this.handleSelectChange(value, 'learningRate')}
          >
            {map(LEARNING_RATES, item => (
              <Option value={item} key={item}>{item}</Option>
            ))}
          </Select>
        </div>
        <div className="panelItem">
          <div className="selectLabel">Epoch</div>
          <Select
            value={this.state.epoch}
            style={{ width: 200 }}
            onChange={value => this.handleSelectChange(value, 'epoch')}
          >
            {map(EPOCHES, item => (
              <Option value={item} key={item}>{item}</Option>
            ))}
          </Select>
        </div>
        <div className="panelItem">
          <div className="selectLabel">Cost Function</div>
          <Select defaultValue={this.state.costFunc} style={{ width: 200 }} disabled />
        </div>
        <div className="sectionTitle">Normalization</div>
        <div className="panelItem">
          <div className="selectLabel">Normalization Function</div>
          <Select defaultValue={this.state.normalizationFunc} style={{ width: 200 }}>
            {map(NORMALIZATION_FUNCS, item => (
              <Option value={item} key={item}>{item}</Option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )

  renderHiddenLayers = () => (
    map(this.state.hiddenLayers, (layer, idx) => (
      <Card
        onMouseEnter={() => this.handleMouseEnterHiddenLayer(idx)}
        onMouseLeave={() => this.handleMouseEnterHiddenLayer(-1)}
        key={idx}
        className="panelItem layerCard"
      >
        {idx === this.state.currentHoverHiddenLayerIndex ?
          <Icon
            className="deleteBtn"
            type="delete"
            onClick={() => this.handleDeleteHiddenLayer(idx)}
          />
          :
          null
        }
        <div className="panelItem"><strong>Hidden Layer {idx + 1}</strong></div>
        <div className="panelItem">
          <div className="selectLabel">Neurons</div>
          <InputNumber
            min={1}
            max={100}
            step={10}
            defaultValue={10}
            style={{ width: 100 }}
            onChange={size => this.handleChangeHiddenLayerSize(size, idx)}
          />
        </div>
        <div className="panelItem">
          <div className="selectLabel">Activation Function</div>
          <Select defaultValue={layer.activationFunc} style={{ width: 100 }} disabled />
        </div>
        <div className="layerShape">
          [{layer.size}, {this.state.hiddenLayers[idx - 1] ?
            this.state.hiddenLayers[idx - 1].size :
            IRIS_DIMS
          }]
        </div>
      </Card>
    ))
  )

  renderOutputLayer = () => {
    const outputLayerSize = this.state.hiddenLayers.length > 0 ?
      this.state.hiddenLayers[this.state.hiddenLayers.length - 1].size :
      IRIS_DIMS;
    return (
      <Card className="panelItem layerCard">
        <div className="panelItem"><strong>Output Layer</strong></div>
        <div className="panelItem">
          <div className="selectLabel">Neurons</div>
          <InputNumber
            defaultValue={3}
            style={{ width: 100 }}
            disabled
          />
        </div>
        <div className="panelItem">
          <div className="selectLabel">Activation Function</div>
          <Select defaultValue="sigmoid" style={{ width: 100 }} disabled />
        </div>
        <div className="layerShape">
          [3, {outputLayerSize}]
        </div>
      </Card>
    );
  }

  renderModelPanel = () => (
    <div className="panel">
      <div className="panelHeader">MODEL</div>
      <div className="panelBody">
        <Card className="panelItem layerCard">
          <div className="panelItem"><strong>Input Data</strong></div>
          <div className="layerShape">[{IRIS_DIMS}, {irisTrainSet.length}]</div>
        </Card>
        {this.renderHiddenLayers()}
        <Button
          className="panelItem"
          style={{ width: 100 }}
          type="primary"
          onClick={this.handleAddLayer}
        >
          ADD
        </Button>
        {this.renderOutputLayer()}
      </div>
    </div>
  )

  renderResultPanel = () => (
    <div className="panel">
      <div className="panelHeader">RESULT</div>
      <div className="panelBody">
        <div className="sectionTitle">Training set</div>
        <div className="panelItem">
          <div className="selectLabel">Total count</div>
          <div>{this.state.trainSetResult.totalCount}</div>
        </div>
        <div className="panelItem">
          <div className="selectLabel">Correct count - Setosa</div>
          <div>{this.state.trainSetResult.setosa.length}</div>
        </div>
        <div className="panelItem">
          <div className="selectLabel">Correct count - Versicolor</div>
          <div>{this.state.trainSetResult.versicolor.length}</div>
        </div>
        <div className="panelItem">
          <div className="selectLabel">Correct Count - Virginica</div>
          <div>{this.state.trainSetResult.virginica.length}</div>
        </div>
        <div className="panelItem">
          <div className="selectLabel">Accuracy</div>
          <div>{(this.state.trainSetResult.correct.length / this.state.trainSetResult.totalCount).toFixed(3)}</div>
        </div>
        <div className="sectionTitle">Test set</div>
        <div className="panelItem">
          <div className="selectLabel">Total count</div>
          <div>{this.state.testSetResult.totalCount}</div>
        </div>
        <div className="panelItem">
          <div className="selectLabel">Correct count - Setosa</div>
          <div>{this.state.testSetResult.setosa.length}</div>
        </div>
        <div className="panelItem">
          <div className="selectLabel">Correct count - Versicolor</div>
          <div>{this.state.testSetResult.versicolor.length}</div>
        </div>
        <div className="panelItem">
          <div className="selectLabel">Correct count - Virginica</div>
          <div>{this.state.testSetResult.virginica.length}</div>
        </div>
        <div className="panelItem">
          <div className="selectLabel">Accuracy</div>
          <div>{(this.state.testSetResult.correct.length / this.state.testSetResult.totalCount).toFixed(3)}</div>
        </div>
      </div>
    </div>
  )

  render() {
    return (
      <SiderLayout
        className="demo"
        siderItems={SIDER_ITEMS}
        currentSiderItemKey="softmax"
      >
        <div className="pageIntro">
          <div className="pageTitle">Softmax classifier</div>
          <div className="pageDesc"><strong>Softmax classifier</strong> gives probabilities for each class label.</div>
        </div>
        {this.renderControlPanel()}
        <div className="modelPanel">
          {this.renderDataPanel()}
          {this.renderModelPanel()}
          {this.renderResultPanel()}
        </div>
        <div className="costPanel">
          <div className="sectionTitle">Cost Graph</div>
          <Chart
            height={400}
            data={this.state.costs}
            scale={{ cost: { min: 0 } }}
            forceFit
          >
            <Axis name="epoch" />
            <Axis name="cost" />
            <Tooltip crosshairs={{ type: 'y' }} />
            <Geom type="line" position="epoch*cost" size={2} />
            <Geom type="point" position="epoch*cost" size={4} shape="circle" style={{ stroke: '#fff', lineWidth: 1 }} />
          </Chart>
        </div>
      </SiderLayout>
    );
  }
}

export default Softmax;
