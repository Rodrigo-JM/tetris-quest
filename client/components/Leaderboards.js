import React, { Component } from "react";
import { connect } from "react-redux";
import { newGame } from "../redux/game";
import { getLeaderboards } from "../redux/leaderboards";
export class Leaderboards extends Component {
  componentDidMount() {
    this.props.getLeaderboards();
  }

  render() {
    return (
      <div>
        <div className="play">
          <a href="/">Play</a>
        </div>
        <ol className="leaderboards">
          {this.props.players.map((player) => {
            console.log(player);
            return (
              <li key={player.id}>
                {player.email} - {player.bestScore}
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    players: state.leaderboards,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    newGame: () => dispatch(newGame()),
    getLeaderboards: () => dispatch(getLeaderboards()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Leaderboards);
