import React, { Component } from "react";
import { connect } from "react-redux";
import { signUser, logUser } from "../redux/user";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

export class AuthForm extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.handleLogin = this.handleLogin.bind(this)
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSignup(event) {
    event.preventDefault();
    this.props.signUser(this.state);
  }

  handleLogin(event) {
    event.preventDefault();
    this.props.logUser(this.state);
  } 

  render() {
    return (
      <div className="user-form">
        <Tabs>
          <TabList>
            <Tab>Login</Tab>
            <Tab>Signup</Tab>
          </TabList>
          <TabPanel>
            <form onSubmit={this.handleLogin}>
              <label htmlFor="email">Email:</label>
              <input name="email" type="text" onChange={this.handleChange} />
              <label htmlFor="password">Password</label>
              <input name="password" type="text" onChange={this.handleChange} />
              <button type="submit">Log In</button>
            </form>
          </TabPanel>
          <TabPanel>
            <form onSubmit={this.handleSignup}>
              <label htmlFor="email">Email:</label>
              <input name="email" type="text" onChange={this.handleChange} />
              <label htmlFor="password">Password</label>
              <input name="password" type="text" onChange={this.handleChange} />
              <button type="submit">Sign Up</button>
            </form>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signUser: (user) => dispatch(signUser(user)),
    logUser: (user) => dispatch(logUser(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthForm);
