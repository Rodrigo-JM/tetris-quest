import Grid from "./components/Grid";
import Modal from "react-modal";
import React, { Component } from "react";
import { connect } from "react-redux";
import AuthForm from "./components/AuthForm";
import { fetchMe, logoutUser } from "./redux/user";
import { pauseGame } from "./redux/game"
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom'
import Leaderboards from './components/Leaderboards'

const modalStyle = {
  content: {
    width: "560px",
    height: "500px",
    opacity: "100%",
    position: "absolute",
    transform: "translate(110%)",
    backgroundColor: "lightblue",
    borderRadius: "10px",
  },
};

export class App extends Component {
  constructor() {
    super();
    this.state = {
      formOpen: false,
    };

    this.openForm = this.openForm.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.logout = this.logout.bind(this)
  }

  openForm() {
    this.setState({ formOpen: true });
    this.props.pause()
  }

  closeForm() {
    this.setState({ formOpen: false });
    // this.propsLogUser()
  }

  logout() {
    this.props.logoutUser()
  }

  componentDidMount() {
    this.props.fetchMe();
  }

  render() {
    return (
      <div className="game">
        <Modal
          isOpen={this.state.formOpen}
          style={modalStyle}
          transparent={true}
          onRequestClose={() => this.closeForm()}
        >
          <AuthForm />
        </Modal>
        <ul className="nav">
          <li className="title">
            <h1>TETRIS QUEST</h1>
          </li>
          {this.props.user.id ? (
            <li>{`Welcome ${this.props.user.email}`} <button onClick={() => this.logout()}>logout</button></li>
          ) : (
            <li className="auth-menu" onClick={() => this.openForm()}>
              <div>Login</div> <div>|</div>
              <div>Signup</div>
            </li>
          )}
        </ul>
        <Router>
          <Switch>
            <Route exact path="/" render={(props) => (this.props.isFetching) ? <div>Loading...</div> : <Grid {...props} />} />
            <Route path="/leaderboards" component={Leaderboards} />
          </Switch>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    game: state.game,
    isFetching: state.isFetching
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchMe: () => dispatch(fetchMe()),
    logoutUser: () => dispatch(logoutUser()),
    pause: () => dispatch(pauseGame()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
