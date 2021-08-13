var React = require('react');

var Footer = React.createClass({


  render: function () {
    return (
      <footer className="footer">
        <ul className="footer-links group">
          <li><a href="#">About Gastos</a></li>
          <li><a href="#">Terms of Use</a></li>
          <li><a href="#">Privacy</a></li>
          <li><a href="#">TrueTechKe</a></li>
        </ul>
      </footer>
    );
  }
});


module.exports = Footer;
