import { Edit, Copy, Trash } from 'react-feather'

import NoteListStyles from './styles/NoteList'
import Skeleton from './styles/Skeleton'

export default () => (
  <NoteListStyles>
    <li className="skeleton">
      <Skeleton height="10vh" background="#000" borderRadius="10px" />
    </li>
    <li className="skeleton">
      <Skeleton height="10vh" background="#000" borderRadius="10px" />
    </li>
    <li className="skeleton">
      <Skeleton height="10vh" background="#000" borderRadius="10px" />
    </li>
  </NoteListStyles>
)
