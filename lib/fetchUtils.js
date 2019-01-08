import moment from 'moment';
import axios from 'axios';

const bacon = 'https://bacon.now.sh/';
const sword = 'https://sword.now.sh/';

export async function fetchDailyText(date) {
  let dt = date;
  if (dt) {
    if (dt.includes('y')) {
      const ys = (dt.match(/y/g) || []).length;
      dt = moment()
        .subtract(ys, 'days')
        .format('YYYY/M/D');
    } else dt = moment(dt).format('YYYY/M/D');
  } else {
    dt = moment().format('YYYY/M/D');
  }
  const url = `${sword}dailyText/${dt}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function fetchText(search) {
  const [bookch, verse] = search.split(':');
  const url = `${sword}${bookch}/${verse}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function fetchNotes(id) {
  const noteid = id || '';
  const url = `${bacon}notes/${noteid}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export const saveNote = ({ title, body }, callback) =>
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

export const updateNote = ({ title, body, _id }) =>
  axios
    .put(`${bacon}notes/${_id}`, {
      title,
      body,
    })
    .catch(error => {
      console.log(error);
    });

export const deleteNote = (id, callback) =>
  axios
    .delete(`${bacon}notes/${id}`)
    .then(response => callback())
    .catch(error => {
      console.log(error);
    });
