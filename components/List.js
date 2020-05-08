import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import List from './styles/List'

const regex = /\d+\s/
const removeNumbers = item => item.replace(regex, '')

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const DND = ({ items, setItems, isOrderedList }) => (
  <DragDropContext
    onDragEnd={result => {
      // dropped outside the list
      if (!result.destination) {
        return
      }

      const newItems = reorder(
        items,
        result.source.index,
        result.destination.index
      )

      setItems(newItems)
    }}
  >
    <Droppable droppableId="droppable">
      {(provided, snapshot) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {items.map((item, index) => (
            <Draggable
              key={index}
              draggableId={`draggable-${index}`}
              index={index}
            >
              {(provided, snapshot) => {
                const { dragHandleProps } = provided
                delete dragHandleProps.tabIndex
                return (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...dragHandleProps}
                  >
                    {isOrderedList
                      ? `${index + 1}. ${removeNumbers(item)}`
                      : item}
                  </div>
                )
              }}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
)

export default ({ list, editOrder }) => {
  const [items, setItems] = useState(list)
  const isOrderedList = items.every(item => regex.test(item))
  console.log({ items, isOrderedList })
  return (
    <List>
      {editOrder ? (
        <DND isOrderedList={isOrderedList} items={items} setItems={setItems} />
      ) : isOrderedList ? (
        <ol>
          {items.map(removeNumbers).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </List>
  )
}
