import { map, omit, pick, values } from 'lodash';
import {
  Array2D,
  initializeParameters,
  forwardPropagation,
  train,
} from 'deeplearning-js';
import iris from './data/iris';

function formatDataSet(dataset, target) {
  const datasetSize = dataset.length;
  let inputValues = [];
  let outputValues = [];

  map(dataset, (example) => {
    const input = omit(example, 'species');
    const output = pick(example, 'species');
    inputValues = inputValues.concat(values(input));
    outputValues = outputValues.concat(output.species === target ? 1 : 0);
  });

  return {
    input: new Array2D(
      [datasetSize, inputValues.length / datasetSize],
      inputValues,
    ).transpose(),
    output: new Array2D(
      [outputValues.length / datasetSize, datasetSize],
      outputValues,
    ),
  };
}

function formatNumToBool(output) {
  return map(output.values, num => (num > 0.5 ? 1 : 0));
}

function predict(
  input,
  output,
  parameters,
  datasetType,
) {
  const forward = forwardPropagation(input, parameters).yHat;
  const predictSet = formatNumToBool(forward);
  const correctSet = formatNumToBool(output);
  let correctCount = 0;
  map(predictSet, (num, idx) => {
    if (num === correctSet[idx]) {
      correctCount += 1;
    }
  });

  console.log(`${datasetType} set accuracy: ${(correctCount / correctSet.length) * 100}%`);
  console.log(`${datasetType} set correct count: ${correctCount}`);
}

export default function logistic(
  target,
  learningRate,
  numOfIterations,
  isNormalized,
  hiddenLayerSize,
  onTrainingend,
) {
  const trainSet = formatDataSet(iris, target);

  const initialParameters = initializeParameters([{
    size: trainSet.input.shape[0],
  }, {
    size: hiddenLayerSize,
    activationFunc: 'relu',
  }, {
    size: trainSet.output.shape[0],
    activationFunc: 'sigmoid',
  }], 0, 1, 0.01);

  train(
    trainSet.input,
    trainSet.output,
    initialParameters,
    'cross-entropy',
    learningRate,
    numOfIterations,
    1,
  ).then((ro) => {
    const { parameters, costs } = ro;
    predict(trainSet.input, trainSet.output, parameters, 'training');
    onTrainingend(parameters, costs);
  }).catch((err) => {
    console.log(err);
  });
}
