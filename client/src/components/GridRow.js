import React from 'react'

export default function GridRow(props) {
    return (
        <tr className={(props.index < 2) ? 'red' : ''}>
            {
                props.row.map((cells, index) => {
                    return <td key={index} data-y={props.index} data-x={index}   className='tile'></td>
                })
            }
        </tr>
    )
}
