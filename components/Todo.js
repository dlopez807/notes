import { useState } from 'react';

import Todo, { Search } from './styles/Todo';

function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default ({ list: initialList, editNote }) => {
  const [list, setList] = useState(initialList);
  const [search, setSearch] = useState('');
  const updateList = async newList => {
    setList(newList);
    const body = newList.reduce((text, item) => `${text}\n${item.join('\t')}`, '');
    const res = await editNote({ body });
  };
  const handleChange = async e => {
    const { name, type, checked, value } = e.target;
    const newList = [...list];
    if (type === 'text') newList[parseInt(name)][0] = value;
    if (type === 'checkbox') newList[parseInt(name)][1] = checked ? 'x' : '';
    await updateList(newList);
  };
  const addItem = async () => {
    const newList = [['', ''], ...list];
    await updateList(newList);
  };
  const deleteItem = async index => {
    const newList = [...list];
    newList.splice(index, 1);
    await updateList(newList);
  };
  const filterItems = item => (search === '' ? item : item[0].includes(search));
  return (
    <>
      <Search placeholder="search" type="text" value={search} onChange={e => setSearch(e.target.value)} />
      <Todo>
        {list
          .filter(filterItems)
          .sort(([, b], [, a]) => (b === a ? 0 : b === 'x' ? 1 : -1))
          .map(([item, checked], index) => (
            <li key={`${index}`}>
              <input type="checkbox" name={index} checked={checked === 'x'} onChange={handleChange} tabIndex="-1" />
              <input readOnly={checked === 'x'} type="text" name={index} value={item} onChange={handleChange} />
              <button type="button" onClick={() => deleteItem(index)} tabIndex="-1">
                -
              </button>
            </li>
          ))}
        <li>
          <button className="add" type="button" onClick={addItem}>
            +
          </button>
        </li>
      </Todo>
    </>
  );
};
