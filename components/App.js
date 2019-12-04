import React, { Component } from 'react';
import 'babel-core/register';
import 'babel-polyfill';

import TextArea from './TextArea';
import { fetchNotes } from '../lib/api';

export default class App extends Component {
  state = {
    notes: [],
  };

  componentDidMount() {
    this.updateNotes();
  }

  updateNotes = () => {
    fetchNotes().then(notes => {
      this.setState({ notes });
    });
  };

  render() {
    const { notes } = this.state;
    return (
      <div className="app">
        <TextArea notes={notes} updateNotes={this.updateNotes} />
      </div>
    );
  }
}
