import Fuse from 'fuse.js'
import { useState, useRef } from 'react'

export default ({ list, options }) => {
  const searchRef = useRef(null)
  const [search, setSearch] = useState('')
  const [tags, setTags] = useState([])
  const fuse = new Fuse(list, options)
  const searchResults =
    search === '' ? list : fuse.search(search).map(result => result.item)
  const results = searchResults.filter(
    result =>
      tags.length > 0
        ? result.tags.some(tag => tags.some(t => t === tag)) ||
          tags.some(
            tag =>
              tag === 'checklist' ? result.title.includes('[ ') : result[tag]
          )
        : true
  )
  const addTag = t => {
    if (
      !tags.includes(t) &&
      list.some(
        item => item.tags.some(tag => tag === t) || item[t] || t === 'checklist'
      )
    ) {
      const newTags = [...tags]
      newTags.push(t)
      setTags(newTags)
    }
  }
  const removeTag = t => {
    const index = tags.findIndex(tag => tag === t)
    if (index > -1) {
      const newTags = [...tags]
      newTags.splice(index, 1)
      setTags(newTags)
    }
  }
  return { search, setSearch, tags, addTag, removeTag, results, searchRef }
}
