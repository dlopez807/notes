import React, { Component } from 'react';
import { array, func } from 'prop-types';
import moment from 'moment';
import * as clipboard from 'clipboard-polyfill';
import Router from 'next/router';

import App from './styles/App';
import Footer from './Footer';
import TextAreaStyles from './styles/TextArea';
import { fetchDailyText, fetchText, updateNote, fetchNotes, saveNote, deleteNote } from '../lib/api';
import copyToClipboard from '../lib/copyToClipboard';

const SPACEBAR_KEY = ' ';
const ARROW_UP_KEY = 'ArrowUp';
const ARROW_DOWN_KEY = 'ArrowDown';
const nba = `PG:
SG:
SF:
PF:
C: `;

class TextArea extends Component {
  state = {
    content: '',
    theme: '',
    mode: '',
    list: '-',
    command: '!',
    loading: true,
    open: false,
  };

  ref = React.createRef();

  componentDidMount = () => {
    const content = localStorage.getItem('notesContent') || '';
    const theme = localStorage.getItem('theme') || '';
    const command = localStorage.getItem('command') || '!';
    this.setState({ content, theme, command, loading: false });
    // this.ref.current.focus();
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { content, theme, command } = this.state;
    if (prevState.content !== content) localStorage.setItem('notesContent', content);
    if (prevState.theme !== theme) localStorage.setItem('theme', theme);
    if (prevState.command !== command) localStorage.setItem('command', command);
  };

  handleChange = e => {
    const { value } = e.target;
    this.setState({ content: value });
  };

  cp = () => {
    const input = this.ref.current;
    console.log({ input });
    input.select();
    document.execCommand('copy');
  };

  copy = () => {
    const input = this.ref.current;
    const isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);

    console.log({ isiOSDevice });
    if (isiOSDevice) {
      const editable = input.contentEditable;
      const { readOnly } = input;

      input.contentEditable = true;
      input.readOnly = false;

      const range = document.createRange();
      range.selectNodeContents(input);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      input.setSelectionRange(0, 999999);
      input.contentEditable = editable;
      input.readOnly = readOnly;
    } else {
      input.select();
    }
    document.execCommand('cut');
    console.log('copied');
  };

  handleKeyDown = async e => {
    const { key, ctrlKey } = e;
    if (key === SPACEBAR_KEY) {
      const lastWordTyped = this.getLastWordTyped();

      if (lastWordTyped.includes(this.state.command)) {
        let command = '';
        let arg = '';

        if (lastWordTyped.includes('-')) {
          const lastWordTypedSplit = lastWordTyped.split('-');
          [command, arg] = lastWordTypedSplit;
          command = command.replace(this.state.command, '');
          if (arg.includes('_')) arg = arg.replace(/_/g, ' ');
        } else command = lastWordTyped.replace(this.state.command, '');

        const loadNote = async title => {
          const { notes } = this.props;
          const selectedNote = notes.find(note => note.title === title);

          if (selectedNote) {
            const note = await fetchNotes(selectedNote._id);

            const content = `${note.title}\n${note.body}`;
            this.replaceTextInNotes(lastWordTyped, content);
          }
        };

        switch (command) {
          // text shortcuts
          case 'copy':
          case 'cp':
            e.preventDefault();
            this.replaceTextInNotes(lastWordTyped, '', () => {
              this.copy();
            });
            break;
          case 'c':
          case 'clear':
            e.preventDefault();
            this.setState({
              content: '',
            });
            break;
          case 'date': {
            e.preventDefault();
            const date = moment().format('M/D/YY');
            this.replaceTextInNotes(lastWordTyped, date);
            break;
          }
          case 'time': {
            e.preventDefault();
            const time = moment().format('h:mm:ss a');
            this.replaceTextInNotes(lastWordTyped, time);
            break;
          }
          case 'dailytext':
          case 'dt': {
            e.preventDefault();
            const date = arg;
            fetchDailyText(date).then(data => {
              if (data.success) {
                this.replaceTextInNotes(lastWordTyped, data.dailyText);
                clipboard.writeText(data.dailyText);
              }
            });
            break;
          }
          case 'nba': {
            e.preventDefault();
            this.replaceTextInNotes(lastWordTyped, nba);
            break;
          }
          // themes
          case 'dark': {
            e.preventDefault();
            this.setState({
              theme: 'dark',
            });
            this.replaceTextInNotes(lastWordTyped, '');
            break;
          }
          case 'cobalt': {
            e.preventDefault();
            this.setState({
              theme: 'cobalt',
            });
            this.replaceTextInNotes(lastWordTyped, '');
            break;
          }
          case 'light': {
            e.preventDefault();
            this.setState({
              theme: '',
            });
            this.replaceTextInNotes(lastWordTyped, '');
            break;
          }
          // notes functions
          case 'load': {
            e.preventDefault();
            const { notes } = this.props;
            const title = arg;
            if (title !== '') {
              loadNote(title);
            } else {
              let loadedNotes = '';
              notes.forEach(note => {
                let noteTitle = note.title;
                if (noteTitle.includes(' ')) {
                  noteTitle = noteTitle.replace(/ /g, '_');
                }
                loadedNotes += `${noteTitle}\n`;
              });
              this.replaceTextInNotes(lastWordTyped, loadedNotes);
            }
            break;
          }
          case 'save': {
            e.preventDefault();
            this.replaceTextInNotes(lastWordTyped, '');
            const { content } = this.state;
            const [title, ...bodyArray] = content.split('\n');
            const body = bodyArray.join('\n').replace(lastWordTyped, '');
            if (title !== '') {
              const { notes } = this.props;
              const selectedNote = notes.find(note => note.title === title);
              if (selectedNote) {
                const { _id } = selectedNote;
                await updateNote({ _id, title, body });
              } else {
                const { updateNotes } = this.props;
                await saveNote({ title, body });
                updateNotes();
              }
            }
            break;
          }
          case 'del':
          case 'delete': {
            e.preventDefault();
            this.replaceTextInNotes(lastWordTyped, '');
            const title = arg;
            const { notes, updateNotes } = this.props;
            if (title !== '') {
              const selectedNote = notes.find(note => note.title === title);
              await deleteNote(selectedNote._id);
              updateNotes();
            }
            break;
          }
          case 'list': {
            e.preventDefault();
            const list = arg === 'ol' ? 1 : '-';
            console.log({ list });
            this.replaceTextInNotes(lastWordTyped, `${list} `);
            this.setState({ mode: `list${arg === 'ol' ? '-ol' : ''}`, list });
            break;
          }
          case 'endlist': {
            e.preventDefault();
            this.replaceTextInNotes(lastWordTyped, '');
            this.setState({ mode: '', list: '-' });
            break;
          }
          case 'q': {
            this.replaceTextInNotes(
              lastWordTyped,
              `Scramble:
// inspection
// cross
// F2L1
// F2L2
// F2L3
// F2L4
// OLL
// PLL
// AUF`
            );
            break;
          }
          case 'setcmd': {
            this.replaceTextInNotes(lastWordTyped, '');
            this.setState({ command: arg });
            break;
          }
          case 'go': {
            e.preventDefault();
            this.replaceTextInNotes(lastWordTyped, '');
            Router.push(`/${arg}`);
            break;
          }
          case 'a': {
            e.preventDefault();
            this.replaceTextInNotes(lastWordTyped, '');
            Router.push('/admin');
            break;
          }
          case 'n': {
            e.preventDefault();
            this.replaceTextInNotes(lastWordTyped, '');
            Router.push('/notepad');
            break;
          }
          case 't': {
            e.preventDefault();
            this.replaceTextInNotes(` ${lastWordTyped}`, '\t');
            break;
          }
          default:
            loadNote(command);
            break;
        }
      } else if (lastWordTyped.includes(':')) {
        fetchText(lastWordTyped).then(data => {
          if (data.success) {
            const scripture = `${data.text} (${data.reference})`;
            this.replaceTextInNotes(lastWordTyped, scripture);
          } else console.log(`${lastWordTyped} is not a valid scripture`);
        });
      }
    } else if (key === ARROW_UP_KEY && ctrlKey) {
      console.log('up');
    } else if (key === ARROW_DOWN_KEY && ctrlKey) {
      console.log('down');
    } else if (key === 'Enter') {
      const { mode, list } = this.state;
      if (mode.includes('list')) {
        console.log('list mode');
        e.preventDefault();
        const newList = mode === 'list-ol' ? list + 1 : '-';
        this.setState(prevState => ({
          content: `${prevState.content}\n${newList} `,
          list: newList,
        }));
      }
    } else if (key === 'Tab') {
      e.preventDefault();
      this.insertTab();
    }
  };

  insertTab = () => {
    const { selectionStart, selectionEnd } = this.ref.current;

    // set textarea value to: text before caret + tab + text after caret
    // $(this).val($(this).val().substring(0, start)
    //   + "\t"
    //   + $(this).val().substring(end));
    const { content } = this.state;
    const newContent = `${content.substring(0, selectionStart)}\t${content.substring(selectionEnd)}`;
    this.setState(
      {
        content: newContent,
      },
      () => {
        // put caret at right position again
        // this.selectionStart =
        //   this.selectionEnd = start + 1;
        this.ref.current.selectionStart = selectionStart + 1;
        this.ref.current.selectionEnd = selectionStart + 1;
      }
    );
  };

  getLastWordTyped = () => {
    const { content } = this.state;
    const contentSplit = content.split('');
    const notesSelectionStart = this.ref.current.selectionStart;
    let spaceIndex = -1;
    for (let i = notesSelectionStart; i > -1; i--) {
      if (i === notesSelectionStart && (contentSplit[i] === ' ' || contentSplit[i] === '\n')) continue;
      if (contentSplit[i] === ' ' || contentSplit[i] === '\n') {
        spaceIndex = i;
        break;
      }
    }
    let lastWord = '';
    for (let i = spaceIndex + 1; i < notesSelectionStart; i++) lastWord += contentSplit[i];
    return lastWord;
  };

  replaceTextInNotes = (lastWordTyped, textReplacement, callback) => {
    const { content } = this.state;
    const { selectionStart } = this.ref.current;
    const newContent = content.replace(lastWordTyped, textReplacement);

    this.setState(
      {
        content: newContent,
      },
      () => {
        const newSelectionStart = selectionStart + (textReplacement.length - lastWordTyped.length);
        this.ref.current.selectionStart = newSelectionStart;
        this.ref.current.selectionEnd = newSelectionStart;
        if (callback) callback();
      }
    );
  };

  moveCaretAtEnd = e => {
    const temp = e.target.value;
    e.target.value = '';
    e.target.value = temp;
  };

  toggleOpen = () => this.setState(state => ({ open: !state.open }));

  render() {
    const { content, theme, loading, open } = this.state;
    if (loading) return null;
    return (
      <App open={open}>
        <textarea
          ref={this.ref}
          value={content}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          className={theme}
          placeholder="notes"
          autoFocus
          onFocus={this.moveCaretAtEnd}
        />
        <Footer
          open={open}
          toggleOpen={this.toggleOpen}
          copy={() => copyToClipboard(content)}
          cut={() => {
            copyToClipboard(content);
            this.setState({ content: '' });
          }}
        />
      </App>
    );
    // return (
    //   <TextAreaStyles
    //     ref={this.ref}
    //     value={content}
    //     onChange={this.handleChange}
    //     onKeyDown={this.handleKeyDown}
    //     className={theme}
    //     placeholder="notes"
    //     autoFocus
    //     onFocus={this.moveCaretAtEnd}
    //   />
    // );
  }
}

TextArea.propTypes = {
  notes: array.isRequired,
  updateNotes: func.isRequired,
};

export default TextArea;
