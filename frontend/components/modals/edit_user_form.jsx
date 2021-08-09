var React = require('react'),
    LinkedStateMixin = require('react-addons-linked-state-mixin'),
    Link = require('react-router').Link;

var CurrentUserStore = require('../../stores/current_user_store'),
    SessionsApiUtil = require('../../util/sessions_api_util'),
    UsersApiUtil = require('../../util/users_api_util'),
    UsersStore = require('../../stores/users_store');


var EditUserFormModal = React.createClass({
  mixins: [LinkedStateMixin],

  getInitialState: function() {
    this.currentUser = CurrentUserStore.currentUser();
    var user = UsersStore.find(this.currentUser.id);

    return {
      user: user,
      fname: user.fname || "",
      lname: user.lname || "",
      gender: user.gender || "",
      age: user.age || "",
      id: user.id,
      image_url: user.image_url,
      imageFile: null
    };
  },

  componentWillMount: function() {
  },

  componentDidMount: function() {
    SessionsApiUtil.fetchCurrentUser();

  },

  componentWillUnmount: function() {

  },

  closeModal: function () {
    this.props.toggleModal();
  },

  setMaleGender: function () {
    this.setState({gender: "Male"});
  },

  setFemaleGender: function () {
    this.setState({gender: "Female"});
  },

  render: function() {
    var image_url = this.state.image_url;

    if (image_url === "/missing.png") {
      image_url = window.Gastos.imageUrls.missing;
    }

    var maleCheck = "",
        femaleCheck = "";

    if (this.state.gender === "Male") {
      maleCheck = "checked";
    } else if (this.state.gender === "Female") {
      femaleCheck = "checked";
    }

    return (
      <div className="modal-edit-form">
        <h1 className="main-header"> About Me</h1>
        <p>Tell us about yourself so we can improve the financial advice we provide.</p>
        <h2 className="about-me">About Me</h2>
        <form className="modal-form group" >

          <fieldset className="modal-form-fieldset">
            <ul>
            <label className="add-picture">Add a profile picture</label>
              <input
                type="file"
                onChange={ this.handleFileChange }/>


            <li className="modal first-name input group">
              <label >First Name</label>
              <input
                type="text"
                valueLink={this.linkState('fname')} />
            </li>

            <li className="modal input group">
              <label>Last Name</label>
              <input
                type="text"
                valueLink={this.linkState('lname')} />
            </li>

            <li className="modal input group">
              <label className="gender group">Gender</label>
                <label className="gender-male">Male
                  <input
                    id="user-gender-male"
                    type="radio"
                    onChange={this.setMaleGender}
                    checked={maleCheck} />
                </label>

                  <label className="gender-female">Female
                    <input
                      id="user-gender-female"
                      type="radio"
                      onChange={this.setFemaleGender}
                      checked={femaleCheck} />
                  </label>

            </li>

            <li className="modal input group">
              <label>Age</label>
              <input
                type="number"
                valueLink={this.linkState('age')} />
            </li>
          </ul>

            <div className="submit">
              <button
                className="update-user-submit"
                onClick={this.handleUpdate}>Submit</button>
            </div>
          </fieldset>
          <img className="preview-image" src={ image_url } />
        </form>
      </div>
    );
  },

  handleFileChange: function (e) {
    var reader = new FileReader(),
        file = e.currentTarget.files[0],
        prev_url = this.state.image_url,
        that = this;

    reader.onloadend = function () {
      that.setState({ image_url: reader.result, imageFile: file });
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      this.setState({ image_url: prev_url, imageFile: null });
    }
  },

  handleUpdate: function (e) {
    var user = new FormData(),
        userId = this.state.id;

    if ( typeof this.state.imageFile !== "undefined"  && this.state.imageFile !== null) {
      user.append("user[avatar]", this.state.imageFile);
    }

    user.append("user[id]", userId);
    user.append("user[fname]", this.state.fname);
    user.append("user[lname]", this.state.lname);
    user.append("user[gender]", this.state.gender);
    user.append("user[age]", this.state.age);

    UsersApiUtil.updateUser(user, userId, this.closeModal);


  }

});

module.exports = EditUserFormModal;
