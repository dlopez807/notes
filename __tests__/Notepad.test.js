import React from 'react'
import format from 'date-fns/format'

import { render, fireEvent } from 'test-utils'
import Notepad from '../components/Notepad'

it('renders notepad component', () => {
  const { getByPlaceholderText } = render(<Notepad />)
  const notepad = getByPlaceholderText('notepad')
  expect(notepad).toBeInTheDocument()
})

it('allows input', () => {
  const { getByPlaceholderText } = render(<Notepad />)
  const notepad = getByPlaceholderText('notepad')
  const text = 'text'
  fireEvent.change(notepad, { target: { value: text } })
  expect(notepad.value).toBe(text)
})

it('performs clear command', () => {
  const { getByPlaceholderText } = render(<Notepad />)
  const notepad = getByPlaceholderText('notepad')
  const text = 'hello !c'
  fireEvent.change(notepad, { target: { value: text } })
  fireEvent.keyDown(notepad, { key: ' ' })
  expect(notepad.value).toBe('')
})

it('performs q command', () => {
  const { getByPlaceholderText } = render(<Notepad />)
  const notepad = getByPlaceholderText('notepad')
  const q = `Scramble:
// inspection
// cross
// F2L1
// F2L2
// F2L3
// F2L4
// OLL
// PLL
// AUF`
  const text = '!q'
  fireEvent.change(notepad, { target: { value: text } })
  fireEvent.keyDown(notepad, { key: ' ' })
  expect(notepad.value).toBe(q)
})

it('performs nba command', () => {
  const { getByPlaceholderText } = render(<Notepad />)
  const notepad = getByPlaceholderText('notepad')
  const nba = `PG:
SG:
SF:
PF:
C: `
  const text = '!nba'
  fireEvent.change(notepad, { target: { value: text } })
  fireEvent.keyDown(notepad, { key: ' ' })
  expect(notepad.value).toBe(nba)
})

it('performs date command', () => {
  const { getByPlaceholderText } = render(<Notepad />)
  const notepad = getByPlaceholderText('notepad')
  const text = '!date'
  fireEvent.change(notepad, { target: { value: text } })
  fireEvent.keyDown(notepad, { key: ' ' })
  expect(notepad.value).toBe(format(new Date(), 'M/d/yy'))
})

it('performs time command', () => {
  const { getByPlaceholderText } = render(<Notepad />)
  const notepad = getByPlaceholderText('notepad')
  const text = '!time'
  fireEvent.change(notepad, { target: { value: text } })
  fireEvent.keyDown(notepad, { key: ' ' })
  expect(notepad.value).toBe(format(new Date(), "h:mmaaaaa'm'"))
})

// it('gets scripture', () => {
//   const { getByPlaceholderText } = render(<Notepad />)
//   const notepad = getByPlaceholderText('notepad')
//   const text = 'gen1:1'
//   fireEvent.change(notepad, { target: { value: text } })
//   fireEvent.keyDown(notepad, { key: ' ' })
//   expect(notepad.value).toBe(text)
// })
