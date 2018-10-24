import React, { Component } from 'react';
require('babel-core/register');
require('babel-polyfill');

import Hammer from 'hammerjs';
import moment from 'moment';
import Pressure from 'pressure';
import { CollegiateDictionary } from 'mw-dict';
import axios from 'axios';

const DICT_API_KEY = '96b2a129-e558-42ff-beda-739a93534361';
const dict = new CollegiateDictionary(DICT_API_KEY);

import noBounce from './noBounce';

export default class App extends Component {
	constructor(props) {
		super(props);
		let notesContent;
		if (storageAvailable('localStorage')) {
			notesContent = localStorage.getItem('notesContent') || '';
		}

		this.state = {
			notesContent: notesContent,
			notes: [],
			currentNoteId: 0
		}
		this.handleKeyPress = this.handleKeyPress.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		wakeupBacon();
		const notesElement = document.querySelector('.notes');
		notesElement.focus();
		setNotesContent(this.state.notesContent);
	}

	handleKeyPress(e) {
		const keyCode = e.which;

		// 32 = space
		if (keyCode == 32) {
			const lastWordTyped = getLastWordTyped();
			const that = this;
			if (lastWordTyped.includes(':')) {
				searchText(lastWordTyped, function (data) {
					if (data.success) {
						const scripture = data.text + ' (' + data.reference + ')';
						replaceTextInNotes(lastWordTyped, scripture);
						that.saveNotesContent();
					}
					else
						console.log(`${lastWordTyped} is not a valid scripture`);
				});
			}
			else if (lastWordTyped.includes('!')) {
				let command = '';
				let arg = '';
				if (lastWordTyped.includes('-')) {
					const lastWordTypedSplit = lastWordTyped.split('-');
					command = lastWordTypedSplit[0].replace('!', '');
					arg = lastWordTypedSplit[1];
					if (arg.includes('_'))
						arg = arg.replace(/_/g, ' ');
				}
				else
					command = lastWordTyped.replace('!', '');
				if (command == 'clear') {
					e.preventDefault();
					setNotesContent('');
				}
				else if (command == 'save') {
					e.preventDefault();
					replaceTextInNotes(lastWordTyped, '');
					that.saveNotesContent();
					let notesContent = getNotesContent();
					let note = {
						title: '',
						body: ''
					}
					if (notesContent.includes('\n')) {
						let [title, ...body] = notesContent.split('\n')
						body = body.join('\n');
						note = { title, body };
					}
					else
						note.title = notesContent;
					saveNote(note, function (newNote) {
						that.setState({
							currentNoteId: newNote._id
						})
					});
				}
				else if (command == 'load') {
					e.preventDefault();
					const noteTitle = arg;
					if (noteTitle != '') {
						replaceTextInNotes(lastWordTyped, '');
						const selectedNote = that.state.notes.find(note => note.title == noteTitle);
						that.setState({
							currentNoteId: selectedNote._id
						});
						//setNotesContent(`${selectedNote.title}\n${selectedNote.body}`);

						getNote(selectedNote._id, function (note) {
							setNotesContent(`${note.title}\n${note.body}`);
							that.saveNotesContent();
						})
					}
					else {
						getNotes(function (notes) {
							that.setState({
								notes: notes
							});
							let notesString = '';
							notes.forEach(function (note) {
								let noteTitle = note.title;
								if (noteTitle.includes(' ')) {
									noteTitle = noteTitle.replace(/ /g, '_');
								}
								notesString += `${noteTitle}\n`;
							})
							replaceTextInNotes(lastWordTyped, notesString);
							that.saveNotesContent();
						})
					}
				}
				else if (command == 'update') {
					e.preventDefault();
					replaceTextInNotes(lastWordTyped, '');
					that.saveNotesContent();
					const noteTitle = arg;
					if (noteTitle != '') {
						const selectedNote = that.state.notes.find(note => note.title == noteTitle);
						updateNote(selectedNote);
					}
				}
				else if (command == 'delete') {
					e.preventDefault();
					replaceTextInNotes(lastWordTyped, '');
					that.saveNotesContent();
					const noteTitle = arg;
					if (noteTitle != '') {
						const selectedNote = that.state.notes.find(note => note.title == noteTitle);
						deleteNote(selectedNote._id);
					}
				}
				else if (command == 'date') {
					e.preventDefault();
					const date = moment().format('M/D/YY');
					replaceTextInNotes(lastWordTyped, date);
					that.saveNotesContent();
				}
				else if (command == 'time') {
					e.preventDefault();
					const time = moment().format('h:mm:ss a');
					replaceTextInNotes(lastWordTyped, time);
					that.saveNotesContent();
				}
				else if (command == 'dailytext' || command == 'dt') {
					e.preventDefault();
					const date = arg;
					getDailyText(date, function (data) {
						if (data.success) {
							replaceTextInNotes(lastWordTyped, data.dailyText);
							that.saveNotesContent();
						}
					});
				}
				else if (command == 'darkmode') {
					e.preventDefault();
					document.querySelector('.notes').classList.toggle('darkMode');
					replaceTextInNotes(lastWordTyped, '');
					that.saveNotesContent();
				}
				else if (command == 'cobalt') {
					e.preventDefault();
					document.querySelector('.notes').classList.toggle('cobalt');
					replaceTextInNotes(lastWordTyped, '');
					that.saveNotesContent();
				}
				else if (command == 'nba') {
					e.preventDefault();
					const nba =
						`PG:
SG:
SF:
PF:
C:  `;
					replaceTextInNotes(lastWordTyped, nba);
					that.saveNotesContent();
				}
				else if (command == 'list') {

				}
				else if (command == 'dict' || command == 'd') {
					e.preventDefault();
					const word = arg;
					if (word != '') {
						getDefinition(word, function (data) {
							let definition = '';
							let definitionElement = data[0];
							definition += `${definitionElement.word} (${definitionElement.functional_label}):\n`;
							let definitionSense = definitionElement.definition[0];
							if (definitionSense.senses) {
								definition += `${definitionSense.number}: `;
								definitionSense.senses.forEach(function (sense) {
									definition += `${sense.number}${sense.meanings}\n`
								})
							}
							else
								definition += `${definitionSense.number}${definitionSense.meanings[0]}\n`;
							replaceTextInNotes(lastWordTyped, definition);
							that.saveNotesContent();
						});
					}
				}
				else if (command == 'thesaurus' || command == 'th') {
					const synonyms = 'synonyms';
					console.log(`other words like ${arg} include ${synonyms}`);
				}
			}
		}
		if (e.ctrlKey && e.metaKey && keyCode == 38) {

			console.log('move line up')
		}
		else if (e.ctrlKey && e.metaKey && keyCode == 40) {
			console.log('move line down')
		}
	}

	handleKeyUp(e) {
		this.saveNotesContent();
	}

	handleChange(e) {
		this.saveNotesContent();
	}

	saveNotesContent() {
		this.setState({
			notesContent: getNotesContent()
		})
		if (storageAvailable('localStorage')) {
			localStorage.setItem('notesContent', getNotesContent());
		}
	}

	render() {
		const placeholderText = 'welcome to niello notes';
		return (
			<div className='app'>
				<textarea
					className='notes'
					placeholder={placeholderText}
					onKeyPress={this.handleKeyPress}
					onKeyUp={this.handleKeyUp}
					onChange={this.handleChange}
				>
				</textarea>
			</div>
		);
	}
};
const bacon = 'https://still-coast-88548.herokuapp.com/bacon/';
const sword = bacon + 'sword/';

const getDefinition = (word, callback) =>
	dict.lookup(word)
		.then(data => callback(data))
		.catch(error => console.log(error));

const fetchBacon = async function () {
	let url = bacon;
	let response = await fetch(url);
	let data = await response.json();
	return data;
}

const wakeupBacon = () =>
	fetchBacon()
		.then(data => console.log(data))
		.catch(error => console.log(error));

const fetchDailyText = async function (date) {
	if (date) {
		if (date.includes('y')) {
			const ys = (date.match(/y/g) || []).length;
			date = moment().subtract(ys, 'days').format('YYYY/M/D');
		}
		else
			date = moment(date).format('YYYY/M/D');
	}
	else {
		date = moment().format('YYYY/M/D');
	}
	let url = sword + '/dailyText/' + date;
	let response = await fetch(url);
	let data = await response.json();
	return data;
}

const getDailyText = (date, callback) =>
	fetchDailyText(date)
		.then(data => callback(data))
		.catch(error => console.log(error));

const fetchText = async function (bookch, verse) {
	let url = sword + '/' + bookch + '/' + verse;
	let response = await fetch(url);
	let data = await response.json();
	return data;
}

const searchText = (search, callback) => {
	search = search.split(':');
	var bookch = search[0];
	var verse = search[1];
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
}
const getNotesSelectionStart = () => document.querySelector('.notes').selectionStart;

const replaceTextInNotes = (lastWordTyped, textReplacement) => {
	let notesContent = getNotesContent();
	const newNotesContent = notesContent.replace(lastWordTyped, textReplacement);
	setNotesContent(newNotesContent);
};

const getLastWordTyped = () => {
	let notesContent = getNotesContent();
	let notesContentSplit = notesContent.split('');
	let notesSelectionStart = getNotesSelectionStart();
	let spaceIndex = -1;
	for (let i = notesSelectionStart; i > -1; i--) {
		if (i == notesSelectionStart && (notesContentSplit[i] == ' ' || notesContentSplit[i] == '\n'))
			continue;
		if (notesContentSplit[i] == ' ' || notesContentSplit[i] == '\n') {
			spaceIndex = i;
			break;
		}
	}

	let lastWord = '';
	for (let i = spaceIndex + 1; i < notesSelectionStart; i++)
		lastWord += notesContentSplit[i];
	return lastWord;
}

const fetchNotes = async function (id) {
	const noteid = id || '';
	let url = 'https://still-coast-88548.herokuapp.com/bacon/notes/' + noteid;
	let response = await fetch(url);
	let data = await response.json();
	return data;
}

const getNotes = (callback) =>
	fetchNotes()
		.then(data => callback(data))
		.catch(error => console.log(error));

const getNote = (noteid, callback) =>
	fetchNotes(noteid)
		.then(data => callback(data))
		.catch(error => console.log(error));

const saveNote = ({ title, body }, callback) =>
	axios.post('https://still-coast-88548.herokuapp.com/bacon/notes', {
		title: title,
		body: body
	})
		.then(function (response) {
			console.log(response);
			callback(response.data.note);
		})
		.catch(function (error) {
			console.log(error);
		});

const updateNote = ({ title, body, _id }) =>
	axios.put('https://still-coast-88548.herokuapp.com/bacon/notes/' + _id, {
		title: title,
		body: body
	})
		.catch(function (error) {
			console.log(error);
		});

const deleteNote = (id) =>
	axios.delete('https://still-coast-88548.herokuapp.com/bacon/notes/' + id)
		.catch(function (error) {
			console.log(error);
		});

// from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
const storageAvailable = (type) => {
	try {
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch (e) {
		return e instanceof DOMException && (
			// everything except Firefox
			e.code === 22 ||
			// Firefox
			e.code === 1014 ||
			// test name field too, because code might not be present
			// everything except Firefox
			e.name === 'QuotaExceededError' ||
			// Firefox
			e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
			// acknowledge QuotaExceededError only if there's something already stored
			storage.length !== 0;
	}
};