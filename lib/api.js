import moment from 'moment';
import axios from 'axios';
import useSWR from 'swr';

import fetch from './fetch';
import { server } from '../config';

const notes = `${server}/api/notes`;

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
  const data = fetch(`${server}/api/sword/dt/${dt}`);
  return data;
}

export const fetchText = async search => fetch(`${server}/api/sword/scriptures/${search}`);

export const fetchNotes = async id => fetch(`${notes}${id ? `/${id}` : ''}`);
export const getNotes = id => useSWR(`${notes}${id ? `/${id}` : ''}`, fetch);
export const searchNotes = query =>
  useSWR(`${notes}/search?${Object.entries(query).reduce((foo, [key, value]) => `${foo}${key}=${value}&`, '')}`, fetch);
export const fetchMd = async text => {
  const response = await axios.post(`${server}/api/md`, { text });
  return response.data;
};
export const md = note =>
  useSWR(() => `${server}/api/md/${note._id}`, async () => fetchMd(`${note.title}\n${note.body}`));

export const saveNote = ({ title, body, slug, tags, hook }, callback) =>
  axios
    .post(`${notes}`, {
      title,
      body,
      slug,
      tags,
      hook,
    })
    .then(response => {
      console.log(response);
      callback(response.data.note);
    })
    .catch(error => {
      console.log(error);
    });

export const updateNote = ({ title, body, slug, tags, hook, _id }) =>
  axios
    .patch(`${notes}/${_id}`, {
      title,
      body,
      slug,
      tags,
      hook,
    })
    .catch(error => {
      console.log(error);
    });

export const deployNote = async _id => axios.post(`${notes}/${_id}`);

export const deleteNote = (id, callback) =>
  axios
    .delete(`${notes}/${id}`)
    .then(response => callback())
    .catch(error => {
      console.log(error);
    });
