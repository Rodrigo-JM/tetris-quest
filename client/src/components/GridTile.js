import React, { Component } from 'react'
import { connect } from 'react-redux'

export const GridTile = (props) => {
    return (
        <td data-y={props.y} data-x={props.x} className={(props.x === props.tiles[0] && props.y === props.tiles[1]) ? 'selectedTile' : 'tile'}>{props.cell}</td>
    )
}

const mapStateToProps = (state) => ({
    tiles: state.piece.center
})

export default connect(mapStateToProps)(GridTile)
