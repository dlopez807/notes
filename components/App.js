import React, { Component } from 'react';
import 'babel-core/register';
import 'babel-polyfill';

import TextArea from './TextArea';
import { fetchBacon, fetchNotes } from '../lib/fetchUtils';

export default class App extends Component {
  state = {
    notes: [],
  };

  componentDidMount() {
    fetchBacon()
      .then(data => console.log(data))
      .catch(error => console.log(error));
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
