import { useState } from 'react'
import Link from 'next/link'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {
  Move,
  X,
  Check,
  Search as SearchIcon,
  CheckSquare,
  ChevronsUp,
  ChevronsDown,
} from 'react-feather'
import { toast } from 'react-toastify'

import Search from './Search'
import List from './styles/List'
import Footer from './styles/Footer'
import { updateNote } from '../lib/api'
import useSearch from '../lib/useSearch'

const numberSpaceRegex = /\d+\s/
const removeNumbers = item => item.replace(numberSpaceRegex, '')

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const DND = ({ items, reorderItems, isOrderedList }) => (
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

      reorderItems(newItems)
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
                      : item}{' '}
                    <Move height="2rem" />
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

const SelectItems = ({ items, selectedItems, setSelectedItems }) => (
  <ul className="selectItems">
    {items.map((item, index) => (
      <li key={index}>
        <span>{item}</span>{' '}
        <input
          type="checkbox"
          checked={selectedItems[index]}
          onChange={() => {
            const newSelectedItems = [...selectedItems]
            newSelectedItems[index] = !newSelectedItems[index]
            setSelectedItems(newSelectedItems)
          }}
        />
      </li>
    ))}
  </ul>
)

export default ({ note: { _id, list, title } }) => {
  const { search, setSearch, results, searchRef } = useSearch({
    list: list || [],
  })
  const [items, setItems] = useState(list)
  const [editListOrder, setEditListOrder] = useState(false)
  const [selectItems, setSelectItems] = useState(false)
  const [selectedItems, setSelectedItems] = useState(items.map(() => false))
  const reorderList = async newItems => {
    if (newItems.length === items.length) {
      setItems(newItems)
      const newBody = `\n${newItems.join('\n')}`
      await updateNote({
        _id,
        body: newBody,
      })
      toast.success('list updated')
    } else toast.error('list reorder failed')
  }
  const isOrderedList = items.every(item => numberSpaceRegex.test(item))
  return (
    <>
      <main>
        <List>
          <h1>{title.replace('= ', '')}</h1>
          <Search
            search={search}
            setSearch={setSearch}
            onChange={e => setSearch(e.target.value)}
            clear={() => setSearch('')}
            onKeyDown={e => {
              const { key } = e
              if (key === 'Escape') {
                setSearch('')
              }
            }}
            searchRef={searchRef}
          />
          {search !== '' && results.length > 0 ? (
            <ul>
              {results.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : editListOrder ? (
            <DND
              isOrderedList={isOrderedList}
              items={items}
              reorderItems={reorderList}
            />
          ) : selectItems ? (
            <SelectItems
              items={items}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
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
      </main>
      <Footer>
        <ul>
          <li>
            <button
              type="button"
              onClick={() => {
                searchRef.current.focus()
              }}
            >
              <SearchIcon />
            </button>
          </li>
          <li>
            <Link href="/notes">
              <a>
                <X />
              </a>
            </Link>
          </li>
          {!editListOrder && (
            <>
              {selectItems && (
                <>
                  <li>
                    <button
                      type="button"
                      disabled={
                        search !== '' ||
                        selectedItems.filter(i => i).length === 0
                      }
                      onClick={async () => {
                        const newItems = [
                          ...items.filter((item, idx) => selectedItems[idx]),
                          ...items.filter((item, idx) => !selectedItems[idx]),
                        ]
                        setItems(newItems)
                        setSelectedItems(items.map(() => false))
                        const newBody = `\n${newItems.join('\n')}`
                        await updateNote({
                          _id,
                          body: newBody,
                        })
                        toast.success('list updated')
                      }}
                    >
                      <ChevronsUp />
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      disabled={
                        search !== '' ||
                        selectedItems.filter(i => i).length === 0
                      }
                      onClick={async () => {
                        const newItems = [
                          ...items.filter((item, idx) => !selectedItems[idx]),
                          ...items.filter((item, idx) => selectedItems[idx]),
                        ]
                        setItems(newItems)
                        setSelectedItems(items.map(() => false))
                        const newBody = `\n${newItems.join('\n')}`
                        await updateNote({
                          _id,
                          body: newBody,
                        })
                        toast.success('list updated')
                      }}
                    >
                      <ChevronsDown />
                    </button>
                  </li>
                </>
              )}
              <li>
                <button
                  type="button"
                  disabled={search !== ''}
                  onClick={() => {
                    setSelectItems(!selectItems)
                  }}
                >
                  {selectItems ? <Check /> : <CheckSquare />}
                </button>
              </li>
            </>
          )}
          {!selectItems && (
            <li>
              <button
                type="button"
                disabled={search !== ''}
                onClick={() => {
                  setEditListOrder(!editListOrder)
                }}
              >
                {editListOrder ? <Check /> : <Move />}
              </button>
            </li>
          )}
        </ul>
      </Footer>
    </>
  )
}
