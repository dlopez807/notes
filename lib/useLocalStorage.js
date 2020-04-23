import { useState, useLayoutEffect } from 'react';

export default (key, value) => {
  const [item, setItem] = useState(value);

  useLayoutEffect(() => {
    const update = async () => {
      const storedItem = localStorage.getItem(key) || value;
      setItem(storedItem);
    };
    update();
  }, []);

  const updateItem = newValue => {
    setItem(newValue);
    localStorage.setItem(key, typeof newValue === 'string' ? newValue : JSON.stringify(newValue));
  };

  return [item, updateItem];
};
