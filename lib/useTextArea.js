import { useRef, useState, useContext } from 'react'
import Router from 'next/router'
import { ThemeContext } from 'styled-components'

import {
  fetchDailyText,
  fetchText,
  getNotes,
  saveNote,
  updateNote,
  deleteNote,
} from './api'
import useLocalStorage from './useLocalStorage'
import copyToClipboard from './copyToClipboard'

const SPACEBAR_KEY = ' '
const regex = /\d+\s/
const removeNumbers = line => line.replace(regex, '')

const getLastWord = (content, textarea) => {
  const contentSplit = content.split('')
  const notesSelectionStart = textarea.current.selectionStart
  let spaceIndex = -1
  for (let i = notesSelectionStart; i > -1; i--) {
    if (
      i === notesSelectionStart &&
      (contentSplit[i] === ' ' || contentSplit[i] === '\n')
    )
      continue
    if (contentSplit[i] === ' ' || contentSplit[i] === '\n') {
      spaceIndex = i
      break
    }
  }
  let lastWord = ''
  for (let i = spaceIndex + 1; i < notesSelectionStart; i++)
    lastWord += contentSplit[i]
  return lastWord
}

// STRINGS
const nba = `PG:
SG:
SF:
PF:
C: `

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

export default () => {
  const [content, setContent] = useLocalStorage('content', '')
  const [commandKey, setCommandKey] = useLocalStorage('command', '!')
  const { updateTheme } = useContext(ThemeContext)
  const textarea = useRef(null)
  const [mode, setMode] = useState('')
  const [list, setList] = useState('-')
  const { data, revalidate } = getNotes()
  const notes = data || []
  const getNote = title => notes.find(n => n.title === title.replace(/_/g, ' '))
  const replace = async (string, newString) => {
    const { selectionStart } = textarea.current
    const newContent = content.replace(string, newString)
    await setContent(newContent)
    const newSelectionStart =
      selectionStart + (newString.length - string.length)
    textarea.current.selectionStart = newSelectionStart
    textarea.current.selectionEnd = newSelectionStart
  }

  // COMMANDS
  const clear = () => setContent('')
  const setcmd = newCommandKey => setCommandKey(newCommandKey)

  const executeCommand = lastWord => {
    const [cmd, ...args] = lastWord.replace(commandKey, '').split('-')
    // console.log({ command, args });

    // COMMAND TEMPLATES
    const createCommand = ({
      fn,
      replaceStr = '',
      go,
      replaceSpace,
      skipReplace,
    }) => () => {
      if (!skipReplace)
        replace(`${replaceSpace ? ' ' : ''}${lastWord}`, replaceStr)
      if (fn) fn()
      if (go || go === '') Router.push(`/${go}`)
    }

    const commands = {
      // string replacement
      nba: createCommand({ replaceStr: nba }),
      q: createCommand({ replaceStr: q }),
      t: createCommand({ replaceStr: '\t', replaceSpace: true }),
      // date
      // time
      dt: createCommand({
        fn: async () => {
          const date = args[0]
          const { success, dailyText } = await fetchDailyText(date)
          console.log({ success, dailyText })
          if (success) replace(lastWord, dailyText)
        },
        skipReplace: true,
      }),

      // go commands
      go: createCommand({ go: args[0] }),
      a: createCommand({ go: 'admin' }),
      n: createCommand({ go: 'notepad' }),

      // notes
      load: createCommand({
        fn: () => {
          if (args.length > 0) {
            const title = args[0]
            const note = getNote(title)
            if (note) {
              replace(lastWord, `${note.title}\n${note.body}`)
            }
          } else {
            replace(
              lastWord,
              notes.reduce(
                (all, note) => `${all}${note.title.replace(/ /g, '_')}\n`,
                ''
              )
            )
          }
        },
      }),
      save: createCommand({
        fn: async () => {
          const [title, ...bodyArray] = content.split('\n')
          const body = bodyArray.join('\n').replace(lastWord, '')
          if (title !== '') {
            const note = notes.find(n => n.title === title)
            if (note) {
              const { _id } = note
              await updateNote({ _id, title, body })
            } else {
              await saveNote({ title, body })
            }
            revalidate()
          }
        },
      }),
      del: createCommand({
        fn: async () => {
          if (args.length > 0) {
            const title = args[0]
            const note = getNote(title)
            if (note) {
              await deleteNote(note._id)
              revalidate()
            }
          }
        },
      }),

      // misc
      setcmd: createCommand({ fn: () => setcmd(args[0]) }),
      c: createCommand({ fn: clear }),
      clear: createCommand({ fn: clear }),
      dark: createCommand({ fn: () => updateTheme('dark') }),
      cobalt: createCommand({ fn: () => updateTheme('cobalt') }),
      light: createCommand({ fn: () => updateTheme('light') }),
      list: createCommand({
        fn: () => {
          const ol = args[0] === 'ol'
          const listType = ol ? 1 : '-'
          replace(lastWord, `${listType} `)
          setMode(`list${ol ? '-ol' : ''}`)
          setList(listType)
        },
      }),
      endlist: createCommand({
        fn: () => {
          setMode('')
          setList('-')
        },
      }),
      ol: createCommand({
        fn: () => {
          const [, ...lines] = content.split('\n')
          const validLine = line =>
            line.trim() !== '' && line.trim() !== lastWord
          const isOrderedList = lines
            .filter(validLine)
            .every(line => regex.test(line))
          let index = 1
          const newLines = isOrderedList
            ? lines.map(removeNumbers)
            : lines.map(line => (validLine(line) ? `${index++} ${line}` : line))
          replace(lines.join('\n'), newLines.join('\n').replace(lastWord, ''))
        },
      }),
    }

    const command = commands[cmd]
    if (command) command()
    else if (cmd === 'cmd') {
      replace(
        lastWord,
        Object.keys(commands).reduce((keys, key) => `${keys}${key}\n`, '')
      )
    } else {
      const note = getNote(cmd)
      if (note) {
        replace(`${commandKey}${cmd}`, `${note.title}\n${note.body}`)
      }
    }
  }
  const handleChange = e => setContent(e.target.value)
  const handleKeyDown = async e => {
    const { key, ctrlKey, altKey } = e
    if (key === SPACEBAR_KEY) {
      const lastWord = getLastWord(content, textarea)
      if (lastWord === '?') {
        replace(lastWord, `cmd = ${commandKey}[command]`)
      } else if (lastWord.includes(':')) {
        const { success, text, reference } = await fetchText(lastWord)
        if (success) replace(lastWord, `${reference}\n${text}`)
        else console.log(`${lastWord} is not a valid scripture`)
      } else if (lastWord.length > 0 && lastWord.startsWith(commandKey)) {
        e.preventDefault()
        executeCommand(lastWord)
      }
    } else if (key === 'Enter') {
      if (mode.includes('list')) {
        e.preventDefault()
        const newList = mode === 'list-ol' ? list + 1 : '-'
        setContent(`${content}\n${newList} `)
        setList(newList)
      }
    } else if (key === 'Tab') {
      e.preventDefault()
      const { selectionStart, selectionEnd } = textarea.current

      const newContent = `${content.substring(
        0,
        selectionStart
      )}\t${content.substring(selectionEnd)}`
      await setContent(newContent)
      textarea.current.selectionStart = selectionStart + 1
      textarea.current.selectionEnd = selectionStart + 1
    } else if (altKey) {
      if (key === '∂') {
        e.preventDefault()
        console.log('copy current line')
      } else if (key === 'ArrowUp' || key === 'ArrowDown') {
        e.preventDefault()
        const { selectionStart } = textarea.current
        const contentArray = content.split('\n')
        let index = 0
        let currentLength = 0
        for (let i = 0; i < contentArray.length; i++) {
          if (currentLength + contentArray[i].length + 1 > selectionStart) {
            index = i
            break
          }
          currentLength += contentArray[i].length + 1 // for \n
        }
        const offset = selectionStart - currentLength
        const swapLines = async direction => {
          const swapIndex = index + (direction === 'ArrowUp' ? -1 : 1)
          contentArray[index] = contentArray.splice(
            swapIndex,
            1,
            contentArray[index]
          )[0]
          await setContent(contentArray.join('\n'))
          // set cursor
          const newStart =
            contentArray.reduce(
              (total, line, idx) =>
                idx <= swapIndex - 1 ? total + line.length + 1 : total,
              0
            ) + offset
          textarea.current.selectionStart = newStart
          textarea.current.selectionEnd = newStart
        }
        if (key === 'ArrowUp') {
          if (index > 0) {
            swapLines(key)
          }
        } else if (index + 1 < contentArray.length) {
          // ArrowDown
          swapLines(key)
        }
      }
    }
  }
  return {
    textarea,
    content,
    handleChange,
    handleKeyDown,
    copy: () => copyToClipboard(content),
    cut: () => {
      copyToClipboard(content)
      setContent('')
    },
  }
}
