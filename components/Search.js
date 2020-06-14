import { X } from 'react-feather'

import Search from './styles/Search'

export default ({ search, onChange, onKeyDown, clear, searchRef, list }) => (
  <Search>
    <input
      ref={searchRef}
      type="text"
      placeholder="search"
      value={search}
      onChange={onChange}
      onKeyDown={onKeyDown}
      list={list}
    />
    {search !== '' && (
      <button type="button" disabled={search === ''} onClick={clear}>
        <X height="2rem" width="2rem" />
      </button>
    )}
  </Search>
)
