var React = require('react');

var ComponentActions = require('../actions/component_actions');

var TransactionIndexItem = React.createClass({

  handleClick: function () {
    this.props.onClick();
  },

  render: function () {
    var rowClass ="",
        categoryClass = "category",
        transaction = this.props.transaction,
        date = ComponentActions.formatDate(transaction.date);

    if (this.props.index % 2 !== 0) {
      rowClass="transaction-row-odd";
    }

    if (transaction.category === "UNCATEGORIZED") {
      categoryClass = "category uncategorized";
    }


    return (
      <tr className={rowClass} onClick={this.handleClick}>
        <td className="date">{date}</td>
        <td className="description">{transaction.description}</td>
        <td className={categoryClass}>{transaction.category}</td>
        <td className="amount">{accounting.formatMoney(transaction.amount)}</td>
      </tr>
    );
  }
});


module.exports = TransactionIndexItem;
