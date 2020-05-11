import Link from 'next/link'
import { Edit, ArrowRightCircle } from 'react-feather'

import Notes from './styles/Notes'

export default ({ notes }) => (
  <Notes>
    {notes.map(({ _id, title, slug }) => (
      <li key={_id}>
        <h2 data-id={_id}>{title}</h2>
        <Link href={`/admin?id=${_id}`} as={`/admin/${_id}`}>
          <a>
            <Edit />
          </a>
        </Link>
        {slug && (
          <Link href={`/${slug}`}>
            <a>
              <ArrowRightCircle />
            </a>
          </Link>
        )}
      </li>
    ))}
  </Notes>
)
