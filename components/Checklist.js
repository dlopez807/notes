import { useState, useRef } from 'react'
import Link from 'next/link'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {
  Move,
  X,
  Check,
  Search as SearchIcon,
  Trash,
  Plus,
  Save,
} from 'react-feather'
import { toast } from 'react-toastify'

import Search from './Search'
import Delete from './Delete'
import Checklist from './styles/Checklist'
import Footer from './styles/Footer'
import { updateNote } from '../lib/api'
import useSearch from '../lib/useSearch'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const ChecklistItem = ({
  item,
  toggleCheck,
  editItem,
  deleteItem,
  addItem,
  changeFocus,
}) => {
  const { name, checked, ref } = item
  return (
    <>
      <input
        type="checkbox"
        checked={checked}
        onChange={toggleCheck}
        readOnly={!toggleCheck}
      />
      <input
        ref={ref}
        className={checked ? 'checked' : undefined}
        readOnly={checked || !editItem}
        type="text"
        name="item"
        value={name}
        onChange={e => editItem(e.target.value)}
        onKeyDown={async e => {
          const { key } = e
          if (addItem && key === 'Enter') await addItem()
          if (deleteItem && name === '' && key === 'Backspace') {
            e.preventDefault()
            const refocus = true
            await deleteItem(refocus)
          }
          if (deleteItem && name === '' && key === 'Delete') {
            e.preventDefault()
            const refocus = true
            const offset = 1
            await deleteItem(refocus, offset)
          }
          if (changeFocus) {
            if (key === 'ArrowUp') {
              changeFocus(-1)
            } else if (key === 'ArrowDown') {
              changeFocus(1)
            }
          }
        }}
      />
      {deleteItem && (
        <Delete handleDelete={deleteItem} tabIndex="-1">
          <Trash />
        </Delete>
      )}
    </>
  )
}

const DND = ({ items, reorderItems, isDuplicate }) => (
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
                    className={isDuplicate(item.name) ? 'duplicate' : undefined}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...dragHandleProps}
                  >
                    <ChecklistItem item={item} />
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

export default ({ note: { _id, table, title, body }, revalidate }) => {
  const checkList = table.map(([name, checked]) => ({
    name,
    checked: checked === 'x',
  }))
  const [items, setItems] = useState(checkList)
  const duplicates = Object.entries(
    items.reduce((list, item) => {
      const { name } = item
      if (list[name]) list[name] += 1
      else list[name] = 1
      return list
    }, {})
  ).reduce((list, entry) => {
    const [key, value] = entry
    if (value > 1) list.push(key)
    return list
  }, [])
  const updateChecklist = async newChecklist => {
    const newBody = newChecklist.reduce(
      (text, item) => `${text}\n${item.name}\t${item.checked ? 'x' : 'o'}`,
      ''
    )
    const { error } = await updateNote({ _id, body: newBody })
    if (error) toast.error('there was an error updating. try again')
    else {
      toast.success('checklist updated')
      revalidate()
    }
  }
  const sortByChecked = ({ checked: b }, { checked: a }) =>
    b === a ? 0 : b ? 1 : -1
  const updateItems = newItems => {
    const sorted = [...newItems].sort(sortByChecked)
    setItems(sorted)
  }
  const { search, setSearch, results, searchRef } = useSearch({
    list: items || [],
    options: {
      keys: ['name'],
    },
  })
  const [editListOrder, setEditListOrder] = useState(false)
  const newItemRef = useRef(null)
  const reorderList = async newItems => {
    if (newItems.length === items.length) {
      updateItems(newItems)
    } else toast.error('checklist reorder failed')
  }
  const addItem = async (index = 0) => {
    const newItem = { name: '', checked: false, ref: newItemRef }
    const newItems = [
      ...items.map(({ name, checked }) => ({
        name,
        checked,
      })),
    ]
    newItems.splice(index, 0, newItem)
    updateItems(newItems)
  }
  const isDuplicate = name => {
    return duplicates.some(duplicate => duplicate === name)
  }
  return (
    <>
      <main>
        <Checklist>
          <h1>{title.replace('[ ', '')}</h1>
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
            <>
              <p>search results for {search}</p>
              <ul>
                {results.map((item, index) => (
                  <li
                    key={index}
                    className={isDuplicate(item.name) ? 'duplicate' : undefined}
                  >
                    <ChecklistItem
                      item={item}
                      toggleCheck={async () => {
                        const newItems = [...items]
                        const idx = newItems.findIndex(
                          itm => itm.name === item.name
                        )
                        newItems[idx].checked = !newItems[idx].checked
                        updateItems(newItems)
                      }}
                      deleteItem={async () => {
                        const newItems = [...items]
                        const idx = newItems.findIndex(
                          itm => itm.name === item.name
                        )
                        newItems.splice(idx, 1)
                        updateItems(newItems)
                      }}
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : editListOrder ? (
            <DND
              items={items}
              reorderItems={reorderList}
              isDuplicate={isDuplicate}
            />
          ) : (
            <ul>
              {items.map((item, index) => (
                <li
                  key={index}
                  className={isDuplicate(item.name) ? 'duplicate' : undefined}
                >
                  <ChecklistItem
                    item={item}
                    toggleCheck={async () => {
                      const newItems = [...items]
                      newItems[index].checked = !newItems[index].checked
                      updateItems(newItems)
                    }}
                    editItem={async newItem => {
                      const newItems = [...items]
                      newItems[index].name = newItem
                      updateItems(newItems)
                    }}
                    deleteItem={async (refocus = false, offset = -1) => {
                      if (refocus && items.length > 1) {
                        const newItems = [
                          ...items.map(({ name, checked }) => ({
                            name,
                            checked,
                          })),
                        ]
                        const newIndex = index + offset
                        newItems[newIndex > -1 ? newIndex : 1].ref = newItemRef
                        newItems.splice(index, 1)
                        await updateItems(newItems)
                        newItemRef.current.focus()
                      } else {
                        const newItems = [...items]
                        newItems.splice(index, 1)
                        updateItems(newItems)
                      }
                    }}
                    addItem={async () => {
                      await addItem(index + 1)
                      newItemRef.current.focus()
                    }}
                    changeFocus={async (offset = 0) => {
                      if (offset !== 0) {
                        const newItems = [
                          ...items.map(({ name, checked }) => ({
                            name,
                            checked,
                          })),
                        ]
                        const newIndex = index + offset
                        if (newIndex > -1 && newIndex < items.length) {
                          if (!newItems[newIndex].checked) {
                            newItems[newIndex].ref = newItemRef
                            await updateItems(newItems)
                            newItemRef.current.focus()
                          }
                        }
                      }
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </Checklist>
      </main>
      <Footer>
        <ul>
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
          <li>
            <button
              type="button"
              disabled={search !== ''}
              onClick={async () => {
                await addItem()
                newItemRef.current.focus()
              }}
            >
              <Plus />
            </button>
          </li>
          <li>
            <button
              disabled={
                body ===
                items.reduce(
                  (text, item) =>
                    `${text}\n${item.name}\t${item.checked ? 'x' : 'o'}`,
                  ''
                )
              }
              type="button"
              onClick={() => {
                const sorted = [...items].sort(sortByChecked)
                updateChecklist(sorted)
              }}
            >
              <Save />
            </button>
          </li>
        </ul>
      </Footer>
    </>
  )
}
