import fetch from 'isomorphic-unfetch';

export default async url => {
  const response = await fetch(url);
  const json = await response.json();
  return json;
};
