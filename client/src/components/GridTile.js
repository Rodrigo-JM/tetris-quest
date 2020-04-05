import React, { Component } from 'react'
import { connect } from 'react-redux'

export const GridTile = (props) => {
    return (
        <td data-y={props.y} data-x={props.x} className={props.tiles.length && (props.x === props.tiles[0][0] && props.y === props.tiles[0][1]) ? 'selectedTile' : 'tile'}>{props.cell}</td>
    )
}

const mapStateToProps = (state) => ({
    tiles: state.pieceTiles
})

export default connect(mapStateToProps)(GridTile)
