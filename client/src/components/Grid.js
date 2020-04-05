import React, { Component } from 'react'
import { connect } from 'react-redux'
import GridRow from './GridRow'
import { createGrid } from '../redux/board'

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

export class Grid extends Component {
    componentDidMount() {
        this.props.build()
        createKeyEvent();   
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
        board: state.board

    }
}

const mapDispatchToProps = dispatch => {
    return {
        build: () => dispatch(createGrid())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid)
