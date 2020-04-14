import React from 'react'
import GridTile from './GridTile'

export default function GridRow(props) {
    console.log('preview', props.preview)
    return (
        <tr className={(props.index < 2) ? 'red' : ''}>
            {
                props.row.map((cells, index) => {
                    return <GridTile x={index} y={props.index} cell={cells} tiles={props.tiles} preview={props.preview}/>
                })
            }
        </tr>
    )
}
