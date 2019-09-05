import React from 'react';
import { makeStyles } from '@material-ui/styles'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import TouchBackend from 'react-dnd-touch-backend'

import Square from './square'
import { ItemTypes } from '../Constants'

const sameField = (a, b) => {
  return a.x === b.x && a.y === b.y
}

const useStyles = makeStyles({
  board: {
    height: 500,
    width: 500,

    display: 'grid',
    gridTemplateColumns: p => `repeat(${p.W}, 1fr)`,
    gridTemplateRows: p => `repeat(${p.H}, 1fr)`,
  }
});

function Board({board, swap}) {
  const W = board.length
  const H = (board[0] || []).length
  const c = useStyles({ W, H })

  const [ selected, setSelected ] = React.useState(undefined)

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className={c.board}
      >
        {(()=>{
          const squares = []
          for (let y = 0; y < H; ++y) {
            for (let x = 0; x < W; ++x) {
              squares.push(
                <Square
                  key={[x,y].join(', ')}
                  tileColor={board[x][y]}
                  dndItem={{
                    type: ItemTypes.TILE,
                    pos: {x, y},
                  }}
                  selected={selected !== undefined && sameField(selected, {x, y})}
                  onDrop={item => {
                    swap(item.pos, {x, y})
                    console.log('dropped', item.pos, 'on: ', {x, y})

                  }}
                  onClick={() => {
                    if (selected === undefined) {
                      setSelected({x, y})
                    } else {
                      if (!sameField(selected, {x, y})) {
                        swap(selected, {x, y})
                      }
                      setSelected(undefined)
                    }
                  }}
                />
              )
            }
          }
          return squares
        })()}
      </div>
    </DndProvider>
  );
}

export default Board;