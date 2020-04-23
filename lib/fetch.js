import fetch from 'isomorphic-unfetch';

export default async (url, body) => {
  const response = await fetch(url, body);
  const json = await response.json();
  return json;
};
