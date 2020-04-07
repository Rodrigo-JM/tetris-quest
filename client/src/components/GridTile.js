import React, { Component } from "react";
import { connect } from "react-redux";

export const GridTile = (props) => {
  const colorTiles = (xy, tiles) => {
    let bool = false ;

    for (let i = 0; i < tiles.length; i++) {
        if (xy[0] === tiles[i][0] && xy[1] === tiles[i][1]) {
            bool = true;
        }
    }
    return bool
  }
  console.log('rendered')
  return (
    <td
      data-y={props.y}
      data-x={props.x}
      className={
        (props.tiles.length &&
        colorTiles([props.x, props.y], props.tiles))
          ? "selectedTile"
          : "tile"
      }
    >
      {props.cell}
    </td>
  );
};

const mapStateToProps = (state) => ({
  tiles: state.pieceTiles,
});

export default connect(mapStateToProps)(GridTile);
