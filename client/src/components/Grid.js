import React, { Component } from 'react'
import { connect } from 'react-redux'
import GridRow from './GridRow'
import { createGrid } from '../redux/board'
import { createPiece, movePiece } from '../redux/pieces'
import { createTiles } from '../redux/piece'

const keysObj = {
   40: 'down',
   37: 'left',
   39: 'right',
   32: 'space',
   90: 'z',
   88: 'x'
}

let currentPieceLocation = []

const locationChanged = (location) => {
    if (location[0] !== currentPieceLocation[0] || location[1] !== currentPieceLocation[1]) {
        currentPieceLocation = location;
        console.log(currentPieceLocation, "<< current location >>", location)
        return true;
    } else {
        return false
    }
}

export class Grid extends Component {
    constructor() {
        super() 
        this.handleKeys = this.handleKeys.bind(this)
    }

    componentDidMount() {
        this.props.build()
        this.createKeyEvent();

        this.props.createPiece(null, 'L');
    }

    componentDidUpdate() {
        console.log('updated')
        if (locationChanged(this.props.piece.center)) {
            this.props.createTiles(this.props.piece, this.props.board)
        }


    }

    handleKeys(event) {
        const move = keysObj[event.keyCode];
        this.props.movePiece(move, this.props.piece)
        this.componentDidUpdate()
    }

    createKeyEvent = () => {
        window.addEventListener('keydown', this.handleKeys)
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
        movePiece: (move, piece) => dispatch(movePiece(move, piece))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid)
