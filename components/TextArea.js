import React, { Component } from 'react';
import { array, func } from 'prop-types';
import moment from 'moment';
import { fetchDailyText, fetchText, updateNote, fetchNotes, saveNote, deleteNote } from '../lib/fetchUtils';

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
  };

  ref = React.createRef();

  componentDidMount = () => {
    const content = localStorage.getItem('notesContent') || '';
    const theme = localStorage.getItem('theme') || '';
    this.setState({ content, theme });
    this.ref.current.focus();
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { content, theme } = this.state;
    if (prevState.content !== content) localStorage.setItem('notesContent', content);
    if (prevState.theme !== theme) localStorage.setItem('theme', theme);
  };

  handleChange = e => {
    const { value } = e.target;
    this.setState({ content: value });
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

  handleKeyDown = e => {
    const { key, ctrlKey } = e;
    if (key === SPACEBAR_KEY) {
      const lastWordTyped = this.getLastWordTyped();

      if (lastWordTyped.includes('!')) {
        let command = '';
        let arg = '';

        if (lastWordTyped.includes('-')) {
          const lastWordTypedSplit = lastWordTyped.split('-');
          [command, arg] = lastWordTypedSplit;
          command = command.replace('!', '');
          if (arg.includes('_')) arg = arg.replace(/_/g, ' ');
        } else command = lastWordTyped.replace('!', '');

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
                this.replaceTextInNotes(lastWordTyped, data.dailyText, () => {
                  console.log(this.ref.current);
                  // this.copy();
                  this.ref.current.select();
                  document.execCommand('cut');
                });
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
              const selectedNote = notes.find(note => note.title === title);

              fetchNotes(selectedNote._id).then(note => {
                const content = `${note.title}\n${note.body}`;
                this.replaceTextInNotes(lastWordTyped, content);
              });
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
                updateNote({ _id, title, body });
              } else {
                const { updateNotes } = this.props;
                saveNote({ title, body }, () => updateNotes());
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
              deleteNote(selectedNote._id, () => updateNotes());
            }
            break;
          }
          case 'list': {
            e.preventDefault();
            this.replaceTextInNotes(lastWordTyped, '- ');
            this.setState({ mode: 'list' });
            break;
          }
          case 'endlist': {
            e.preventDefault();
            this.replaceTextInNotes(lastWordTyped, '');
            this.setState({ mode: '' });
            break;
          }
          default:
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
      const { mode } = this.state;
      if (mode === 'list') {
        console.log('list mode');
        e.preventDefault();
        this.setState(prevState => ({
          content: `${prevState.content}\n- `,
        }));
      }
    }
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

  render() {
    const { content, theme } = this.state;
    return (
      <textarea
        ref={this.ref}
        value={content}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        className={theme}
        placeholder="welcome to niello notes"
      />
    );
  }
}

TextArea.propTypes = {
  notes: array.isRequired,
  updateNotes: func.isRequired,
};

export default TextArea;
