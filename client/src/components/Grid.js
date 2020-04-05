import React, { Component } from 'react'
import { connect } from 'react-redux'
import GridRow from './GridRow'
import { createGrid } from '../redux/board'
import { createPiece } from '../redux/pieces'
import { createTiles } from '../redux/piece'

const keysObj = {
   40: 'down',
   37: 'left',
   39: 'right',
   32: 'space',
   90: 'z',
   88: 'x'
}

const createKeyEvent = () => {
    window.addEventListener('keydown', function(event) {
        console.log(keysObj[event.keyCode])
    })
}

let currentPieceLocation = []

const locationChanged = (location) => {
    if (location[0] !== currentPieceLocation[0] || location[1] !== currentPieceLocation[1]) {
        currentPieceLocation = location;
        return true;
    } else {
        return false
    }
}

export class Grid extends Component {

    componentDidMount() {
        this.props.build()
        createKeyEvent();

        this.props.createPiece(null, 'BLOCK');
    }

    componentDidUpdate() {

        if (locationChanged(this.props.piece.center)) {
            this.props.createTiles(this.props.piece, this.props.board)
        }


    }
    render() {
        return (
            <table>
                <tbody>
                {
                    this.props.board.map((row, index) => {
                        return <GridRow index={index} key={index} row={row} />
                    }).reverse()
                }
                </tbody>
            </table>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        board: state.board,
        piece: state.piece,
        tiles: state.pieceTiles,

    }
}

const mapDispatchToProps = dispatch => {
    return {
        build: () => dispatch(createGrid()),
        createPiece: (center, type) => dispatch(createPiece(center, type)), 
        createTiles: (piece, grid) => dispatch(createTiles(piece, grid)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid)
