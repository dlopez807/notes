import moment from 'moment';
import axios from 'axios';
import useSWR from 'swr';

const fetcher = url => fetch(url).then(res => res.json())

const notes = '/api/notes';

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
  const data = await fetcher(`/api/sword/dt/${dt}`);
  return data;
}

export const fetchText = async text => fetcher(`/api/sword/scriptures/${text}`);

export const fetchNotes = async id => fetcher(`${notes}${id ? `/${id}` : ''}`);
export const getNotes = id => useSWR(`${notes}${id ? `/${id}` : ''}`, fetcher);
export const searchNotes = query =>
  useSWR(`${notes}/search?${Object.entries(query).reduce((queryString, [key, value]) => `${queryString}${key}=${value}&`, '')}`, fetcher);

export const saveNote = async ({ title, body, slug, tags, hook }) =>
  axios.post(`${notes}`, {
    title,
    body,
    slug,
    tags,
    hook,
  });

export const updateNote = async ({ title, body, slug, tags, hook, _id }) =>
  axios.patch(`${notes}/${_id}`, {
    title,
    body,
    slug,
    tags,
    hook,
  });

export const deployNote = async id => axios.post(`${notes}/${id}`);

export const deleteNote = async id => axios.delete(`${notes}/${id}`);
