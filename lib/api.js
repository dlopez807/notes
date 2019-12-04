import moment from 'moment';
import axios from 'axios';

import fetch from './fetch';
import { server } from '../config';

const bacon = 'https://bacon.now.sh/';
// const sword = 'https://sword.now.sh/';

// export async function fetchDailyText1(date) {
//   let dt = date;
//   if (dt) {
//     if (dt.includes('y')) {
//       const ys = (dt.match(/y/g) || []).length;
//       dt = moment()
//         .subtract(ys, 'days')
//         .format('YYYY/M/D');
//     } else dt = moment(dt).format('YYYY/M/D');
//   } else {
//     dt = moment().format('YYYY/M/D');
//   }
//   const url = `${sword}dailyText/${dt}`;
//   const data = await fetch(url);
//   return data;
// }

export async function fetchDailyText(date) {
  let dt = date;
  if (dt) {
    if (dt.includes('y')) {
      const ys = (dt.match(/y/g) || []).length;
      dt = moment()
        .subtract(ys, 'days')
        .format('YYYY-M-D');
    } else dt = moment(dt).format('YYYY-M-D');
  } else {
    dt = moment().format('YYYY-M-D');
  }
  // const url = `${sword}dailyText/${dt}`;
  // const data = await fetch(url);
  const data = fetch(`${server}/api/sword/dt/${dt}`);
  return data;
}

// export async function fetchText1(search) {
//   const [bookch, verse] = search.split(':');
//   const url = `${sword}${bookch}/${verse}`;
//   const data = await fetch(url);
//   return data;
// }

export const fetchText = async search => fetch(`${server}/api/sword/scriptures/${search}`);

export const fetchNotes = async id => fetch(`${bacon}notes/${id || ''}`);

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
