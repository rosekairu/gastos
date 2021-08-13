var React = require('react'),
    PieChart = require('react-chartjs').Pie;

var ComponentActions = require('../../actions/component_actions'),
    TransactionStore = require('../../stores/transaction'),
    ApiUtil  = require('../../util/api_util'),
    FlashStore = require('../../stores/flash'),
    FlashActions = require('../../actions/flash_actions');

var chartOptions = {
  animation: true,
  animationEasing: "easeOutQuart",
  showTooltips: true,
  scaleShowLabels: true,
  tooltipTemplate: "<%=label%>: <%= Math.round(circumference / 6.283 * 100) %>%",
  scaleLabel: function(label) {
    return label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  },
  datasetLabel: function(label) {
    return label.datasetLabel + ': ' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
};


var _highlights = {
  0: "#87d6be",
  1: "#b78fb9",
  2: "#e19f8f",
  3: "#77a8c9",
  4: "#e7bd85"
};
var _colors = {
  0: "#61c9aa",
  1: "#a36fa6",
  2: "#d67d67",
  3: "#5391ba",
  4: "#dea65b"
};


var TransactionsPieChart = React.createClass({


  getInitialState: function () {
    return { transactions: TransactionStore.all() };
  },

  _updateFlash: function () {
    this.setState({flash: FlashStore.all()});
  },

  componentDidMount: function () {
    ApiUtil.fetchTransactions(this.state.page);
    this.storeListener = TransactionStore.addListener(this.onChange);
  },

  onChange: function () {
    this.setState({ transactions: TransactionStore.all()});
  },

  componentWillUnmount: function () {
    this.storeListener.remove();
  },

  generateLegend: function () {
    var that = this;
    return Object.keys(this.transCats).map(function(cat, index) {
      var color = that.getColor(index);
      color = "h" + color.slice(1, color.length);
      return (
        <li className="group" key={index}>
          <div className={color} ></div>
          <p className="chart-legend-cat">{cat} </p>
          <p>{accounting.formatMoney(that.transCats[cat])}</p>
        </li>
      );
    });
  },


  getChartData: function () {
    var that = this;
    this.transCats = ComponentActions.getTopTransactionCategories(this.state.transactions);
    var data = [];
    Object.keys(this.transCats).forEach(function(cat, index) {
      data.push(
        {
          value: that.transCats[cat],
          label: cat,
          highlight: that.getHighlight(index),
          color: that.getColor(index)
        }
      );
    });

    return data;
  },

  getHighlight: function (index) {
    return _highlights[index];
  },

  getColor: function (index) {
    return _colors[index];
  },

  render: function() {

    return (
      <div className="pie-chart-container group">
        <h1 className="chart-header group">Top 5 Transaction Categories</h1>
        <PieChart data={this.getChartData()} options={chartOptions} className="chart" width="550" height="200"/>
        <ul className="legend">
          {this.generateLegend()}
        </ul>
      </div>

    );
  }
});



module.exports = TransactionsPieChart;
