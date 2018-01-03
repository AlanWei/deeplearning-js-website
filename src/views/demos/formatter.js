import map from 'lodash/map';
import keys from 'lodash/keys';

function formatCostsToChartData(costs) {
  return map(costs, cost => ({
    i: keys(cost)[0],
    cost: cost[keys(cost)[0]],
  }));
}

export {
  formatCostsToChartData,
};
