import React, { Component } from 'react';
import 'babel-core/register';
import 'babel-polyfill';
import axios from 'axios';
import moment from 'moment';
import { CollegiateDictionary } from 'mw-dict';

import noBounce from '../lib/noBounce';
import TextArea from './TextArea';
import { fetchNotes } from '../lib/fetchUtils';

const DICT_API_KEY = '96b2a129-e558-42ff-beda-739a93534361';
const dict = new CollegiateDictionary(DICT_API_KEY);

export default class App extends Component {
  state = {
    notesContent: localStorage.getItem('notesContent') || '',
    notes: [],
    currentNoteId: 0,
  };

  componentDidMount() {
    wakeupBacon();
    this.updateNotes();
    // const notesElement = document.querySelector('.notes');
    // notesElement.focus();
    // setNotesContent(this.state.notesContent);
  }

  updateNotes = () => {
    fetchNotes().then(notes => {
      this.setState({ notes });
    });
  };

  handleKeyPress = e => {
    console.log('e.target.value', e.target.value);
    const keyCode = e.which;

    // 32 = space
    if (keyCode === 32) {
      const lastWordTyped = getLastWordTyped();
      const that = this;
      if (lastWordTyped.includes(':')) {
        searchText(lastWordTyped, data => {
          if (data.success) {
            const scripture = `${data.text} (${data.reference})`;
            replaceTextInNotes(lastWordTyped, scripture);
            that.saveNotesContent();
          } else console.log(`${lastWordTyped} is not a valid scripture`);
        });
      } else if (lastWordTyped.includes('!')) {
        let command = '';
        let arg = '';
        if (lastWordTyped.includes('-')) {
          const lastWordTypedSplit = lastWordTyped.split('-');
          command = lastWordTypedSplit[0].replace('!', '');
          arg = lastWordTypedSplit[1];
          if (arg.includes('_')) arg = arg.replace(/_/g, ' ');
        } else command = lastWordTyped.replace('!', '');
        if (command === 'clear') {
          e.preventDefault();
          setNotesContent('');
        } else if (command === 'save') {
          e.preventDefault();
          replaceTextInNotes(lastWordTyped, '');
          that.saveNotesContent();
          const notesContent = getNotesContent();
          let note = {
            title: '',
            body: '',
          };
          if (notesContent.includes('\n')) {
            let [title, ...body] = notesContent.split('\n');
            body = body.join('\n');
            note = { title, body };
          } else note.title = notesContent;
          saveNote(note, newNote => {
            that.setState({
              currentNoteId: newNote._id,
            });
          });
        } else if (command === 'load') {
          e.preventDefault();
          const noteTitle = arg;
          if (noteTitle != '') {
            replaceTextInNotes(lastWordTyped, '');
            const selectedNote = that.state.notes.find(note => note.title === noteTitle);
            that.setState({
              currentNoteId: selectedNote._id,
            });
            // setNotesContent(`${selectedNote.title}\n${selectedNote.body}`);

            getNote(selectedNote._id, note => {
              setNotesContent(`${note.title}\n${note.body}`);
              that.saveNotesContent();
            });
          } else {
            getNotes(notes => {
              that.setState({
                notes,
              });
              let notesString = '';
              notes.forEach(note => {
                let noteTitle = note.title;
                if (noteTitle.includes(' ')) {
                  noteTitle = noteTitle.replace(/ /g, '_');
                }
                notesString += `${noteTitle}\n`;
              });
              replaceTextInNotes(lastWordTyped, notesString);
              that.saveNotesContent();
            });
          }
        } else if (command == 'update') {
          e.preventDefault();
          replaceTextInNotes(lastWordTyped, '');
          that.saveNotesContent();
          const noteTitle = arg;
          if (noteTitle != '') {
            const selectedNote = that.state.notes.find(note => note.title == noteTitle);
            updateNote(selectedNote);
          }
        } else if (command == 'delete') {
          e.preventDefault();
          replaceTextInNotes(lastWordTyped, '');
          that.saveNotesContent();
          const noteTitle = arg;
          if (noteTitle != '') {
            const selectedNote = that.state.notes.find(note => note.title == noteTitle);
            deleteNote(selectedNote._id);
          }
        } else if (command == 'date') {
          e.preventDefault();
          const date = moment().format('M/D/YY');
          replaceTextInNotes(lastWordTyped, date);
          that.saveNotesContent();
        } else if (command == 'time') {
          e.preventDefault();
          const time = moment().format('h:mm:ss a');
          replaceTextInNotes(lastWordTyped, time);
          that.saveNotesContent();
        } else if (command == 'dailytext' || command == 'dt') {
          e.preventDefault();
          const date = arg;
          getDailyText(date, data => {
            if (data.success) {
              replaceTextInNotes(lastWordTyped, data.dailyText);
              that.saveNotesContent();
            }
          });
        } else if (command == 'darkmode') {
          e.preventDefault();
          document.querySelector('.notes').classList.toggle('dark');
          replaceTextInNotes(lastWordTyped, '');
          that.saveNotesContent();
        } else if (command == 'cobalt') {
          e.preventDefault();
          document.querySelector('.notes').classList.toggle('cobalt');
          replaceTextInNotes(lastWordTyped, '');
          that.saveNotesContent();
        } else if (command == 'nba') {
          e.preventDefault();
          const nba = `PG:
SG:
SF:
PF:
C:  `;
          replaceTextInNotes(lastWordTyped, nba);
          that.saveNotesContent();
        } else if (command == 'list') {
        } else if (command == 'dict' || command == 'd') {
          e.preventDefault();
          const word = arg;
          if (word != '') {
            getDefinition(word, data => {
              let definition = '';
              const definitionElement = data[0];
              definition += `${definitionElement.word} (${definitionElement.functional_label}):\n`;
              const definitionSense = definitionElement.definition[0];
              if (definitionSense.senses) {
                definition += `${definitionSense.number}: `;
                definitionSense.senses.forEach(sense => {
                  definition += `${sense.number}${sense.meanings}\n`;
                });
              } else definition += `${definitionSense.number}${definitionSense.meanings[0]}\n`;
              replaceTextInNotes(lastWordTyped, definition);
              that.saveNotesContent();
            });
          }
        } else if (command == 'thesaurus' || command == 'th') {
          const synonyms = 'synonyms';
          console.log(`other words like ${arg} include ${synonyms}`);
        }
      }
    }
    if (e.ctrlKey && e.metaKey && keyCode == 38) {
      console.log('move line up');
    } else if (e.ctrlKey && e.metaKey && keyCode == 40) {
      console.log('move line down');
    }
  };

  handleKeyUp = e => {
    this.saveNotesContent();
  };

  handleChange = e => {
    console.log('onchange');
    this.saveNotesContent();
  };

  saveNotesContent() {
    this.setState({
      notesContent: getNotesContent(),
    });

    localStorage.setItem('notesContent', getNotesContent());
  }

  render() {
    // const placeholderText = 'welcome to niello notes';
    // return (
    //   <div className="app">
    //     <textarea
    //       autoFocus
    //       className="notes"
    //       placeholder={placeholderText}
    //       onKeyPress={this.handleKeyPress}
    //       onKeyUp={this.handleKeyUp}
    //       onChange={this.handleChange}
    //     />
    //   </div>
    // );
    const { notes } = this.state;
    return (
      <div className="app">
        <TextArea notes={notes} updateNotes={this.updateNotes} />
      </div>
    );
  }
}
const bacon = 'https://still-coast-88548.herokuapp.com/bacon/';
const sword = `${bacon}sword/`;

const getDefinition = (word, callback) =>
  dict
    .lookup(word)
    .then(data => callback(data))
    .catch(error => console.log(error));

const fetchBacon = async function() {
  const url = bacon;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const wakeupBacon = () =>
  fetchBacon()
    .then(data => console.log(data))
    .catch(error => console.log(error));

const fetchDailyText = async function(date) {
  if (date) {
    if (date.includes('y')) {
      const ys = (date.match(/y/g) || []).length;
      date = moment()
        .subtract(ys, 'days')
        .format('YYYY/M/D');
    } else date = moment(date).format('YYYY/M/D');
  } else {
    date = moment().format('YYYY/M/D');
  }
  const url = `${sword}/dailyText/${date}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const getDailyText = (date, callback) =>
  fetchDailyText(date)
    .then(data => callback(data))
    .catch(error => console.log(error));

const fetchText = async function(bookch, verse) {
  const url = `${sword}/${bookch}/${verse}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

const searchText = (search, callback) => {
  search = search.split(':');
  const bookch = search[0];
  const verse = search[1];
  fetchText(bookch, verse)
    .then(data => callback(data))
    .catch(error => console.log(error));
};

const getNotesContent = () => document.querySelector('.notes').value;
const setNotesContent = (content, selection) => {
  document.querySelector('.notes').value = content;
  if (selection) {
    document.querySelector('.notes').selectionStart = selection;
    document.querySelector('.notes').selectionEnd = selection;
  }
};
const getNotesSelectionStart = () => document.querySelector('.notes').selectionStart;

const replaceTextInNotes = (lastWordTyped, textReplacement) => {
  const notesContent = getNotesContent();
  const newNotesContent = notesContent.replace(lastWordTyped, textReplacement);
  setNotesContent(newNotesContent);
};

const getLastWordTyped = () => {
  const notesContent = getNotesContent();
  const notesContentSplit = notesContent.split('');
  const notesSelectionStart = getNotesSelectionStart();
  let spaceIndex = -1;
  for (let i = notesSelectionStart; i > -1; i--) {
    if (i == notesSelectionStart && (notesContentSplit[i] == ' ' || notesContentSplit[i] == '\n')) continue;
    if (notesContentSplit[i] == ' ' || notesContentSplit[i] == '\n') {
      spaceIndex = i;
      break;
    }
  }

  let lastWord = '';
  for (let i = spaceIndex + 1; i < notesSelectionStart; i++) lastWord += notesContentSplit[i];
  return lastWord;
};

// const fetchNotes = async function(id) {
//   const noteid = id || '';
//   const url = `${bacon}notes/${noteid}`;
//   const response = await fetch(url);
//   const data = await response.json();
//   return data;
// };

const getNotes = callback =>
  fetchNotes()
    .then(data => callback(data))
    .catch(error => console.log(error));

const getNote = (noteid, callback) =>
  fetchNotes(noteid)
    .then(data => callback(data))
    .catch(error => console.log(error));

const saveNote = ({ title, body }, callback) =>
  axios
    .post(`${bacon}notes`, {
      title,
      body,
    })
    .then(response => {
      console.log(response);
      callback(response.data.note);
    })
    .catch(error => {
      console.log(error);
    });

const updateNote = ({ title, body, _id }) =>
  axios
    .put(`${bacon}notes/${_id}`, {
      title,
      body,
    })
    .catch(error => {
      console.log(error);
    });

const deleteNote = id =>
  axios.delete(`${bacon}notes/${id}`).catch(error => {
    console.log(error);
  });
