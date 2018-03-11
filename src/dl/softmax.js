import { map, omit, pick, values, indexOf, max } from 'lodash';
import {
  initializeParameters,
  forwardPropagation,
  batchTrain,
  Normalization,
  transpose,
} from 'deeplearning-js';
import * as irisTrain from './data/iris.train';
import * as irisTest from './data/iris.test';

function formatDataSet(dataset) {
  const inputValues = [];
  const outputValues = [];

  map(dataset, (example, idx) => {
    const input = omit(example, 'species');
    const output = pick(example, 'species');
    inputValues[idx] = values(input);
    let result = [1, 0, 0];
    switch (output.species) {
      case 'setosa':
        result = [1, 0, 0];
        break;
      case 'versicolor':
        result = [0, 1, 0];
        break;
      case 'virginica':
        result = [0, 0, 1];
        break;
      default:
        break;
    }
    outputValues[idx] = result;
  });

  return {
    input: map(transpose(inputValues), subArray => (
      Normalization.zscore(subArray)
    )),
    output: transpose(outputValues),
  };
}

function predict(
  input,
  output,
  parameters,
  step,
) {
  const forward = forwardPropagation(input, parameters).yHat;
  const transform = map(transpose(forward), (subArray) => {
    const maxIdx = indexOf(subArray, max(subArray));
    return map(subArray, (num, idx) => (idx === maxIdx ? 1 : 0));
  });
  const predictSet = transpose(transform);

  const correctCount = [];
  const correctCount1 = [];
  const correctCount2 = [];
  const correctCount3 = [];
  let totalCount = 0;
  map(transpose(predictSet), (subArray, idx) => {
    const correctSubArr = transpose(output)[idx];
    const maxIdx = indexOf(subArray, max(subArray));
    const correctMaxIdx = indexOf(correctSubArr, max(correctSubArr));
    if (maxIdx === correctMaxIdx) {
      if (idx < step) {
        correctCount1.push(idx);
      } else if (idx >= step && idx < step * 2) {
        correctCount2.push(idx);
      } else {
        correctCount3.push(idx);
      }
      correctCount.push(idx);
    }
    totalCount += 1;
  });

  return {
    totalCount,
    correct: correctCount,
    setosa: correctCount1,
    versicolor: correctCount2,
    virginica: correctCount3,
  };
}

export default function softmax(
  hiddenLayers,
  learningRate,
  numOfIterations,
  onBatchTrainEnd,
  onTrainEnd,
  batchSize = 10,
) {
  const trainSet = formatDataSet(irisTrain);

  const inputLayer = [{
    size: trainSet.input.length,
  }];
  const outputLayer = [{
    size: 3,
    activationFunc: 'softmax',
  }];
  const model = inputLayer.concat(hiddenLayers).concat(outputLayer);

  const initialParameters = initializeParameters(model);

  batchTrain(
    0,
    numOfIterations / batchSize,
    batchSize,
    trainSet.input,
    trainSet.output,
    initialParameters,
    learningRate,
    'cross-entropy',
    onBatchTrainEnd,
    onTrainEnd,
  );
}

function getTrainSet() {
  return formatDataSet(irisTrain);
}

function getTestSet() {
  return formatDataSet(irisTest);
}

export {
  softmax,
  predict,
  getTrainSet,
  getTestSet,
};
