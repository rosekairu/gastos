var React = require('react'),
    LinkedStateMixin = require('react-addons-linked-state-mixin');

var SearchResultsStore = require('../stores/search_results_store'),
    SearchApiUtil = require('../util/search_api_util'),
    TransactionIndexItem = require('./transaction_index_item'),
    TransactionItemForm = require('./transaction_form');

var Search = React.createClass({
  mixins: [LinkedStateMixin],

  getInitialState: function () {

    return {
      page: 1,
      query: "",
      results: SearchResultsStore.all(),
      totalCount: SearchResultsStore.meta().totalCount
    };
  },

  componentDidMount: function() {
    this.listener = SearchResultsStore.addListener(this._onChange);
  },

  handleInput: function (event) {
    this.setState({ query: event.currentTarget.value });
  },

  _onChange: function() {

    var results = SearchResultsStore.all(),
        that = this;

    if (this.props.account) {
      filteredResults = [];
      results.forEach(function(result) {
        if (result.account_id === that.props.account) {
          filteredResults.push(result);
        }
      });
      this.props.search(filteredResults, this.state.query, filteredResults.length);
      this.setState({results: filteredResults, totalCount: filteredResults.length, query: ""});
    } else {
      this.props.search(results, this.state.query, SearchResultsStore.meta().totalCount);
      this.setState({results: results, totalCount: SearchResultsStore.meta().totalCount, query: ""});
    }

  },

  search: function () {
    var query = this.state.query;
    if (query !== "") {
      SearchApiUtil.search(query, 1);

    } else {
      this.setState({
        results: []
      });
      this.props.search(this.state.results, this.state.query);
    }
  },

  handleKeyDown: function (e) {
    if (e.keyCode === 13) {
      this.search();
    }
  },

  nextPage: function () {
    var nextPage = this.state.page + 1;
    SearchApiUtil.search(this.state.query, nextPage);

    this.setState({page: nextPage});
  },

  componentWillUnmount: function() {
    this.listener.remove();
  },

  makeFormIndex: function (index) {
    this.setState({formIndex: index});
  },

  render: function() {
    var that = this,
        results = this.state.results,
        totalCount = this.state.totalCount,
        query = this.state.query;

    return (
      <div className="search-component">
        <input
          type="text"
          onChange={this.handleInput} value={query}
          onKeyDown={this.handleKeyDown}
          placeholder="Search for a transaction" />
        <button className="search-button" onClick={this.search}>Search</button>
      </div>
    );
  }


});

module.exports = Search;
