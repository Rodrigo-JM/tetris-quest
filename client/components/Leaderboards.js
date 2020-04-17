import React, { Component } from "react";
import { connect } from "react-redux";
import { getLeaderboards } from "../redux/leaderboards";
export class Leaderboards extends Component {
  componentDidMount() {
    this.props.getLeaderboards();
  }

  render() {
    return (
      <div>
        <button
          onClick={() => {
            this.props.history.push("/");
          }}
        >
          Play
        </button>
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
    getLeaderboards: () => dispatch(getLeaderboards()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Leaderboards);
