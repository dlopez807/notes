import { X } from 'react-feather'

export default ({ search, onChange, onKeyDown, clear, searchRef, list }) => (
  <div className="search">
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
  </div>
)
