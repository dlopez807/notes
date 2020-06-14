import Link from 'next/link'
import {
  X,
  LogOut,
  FilePlus,
  Search as SearchIcon,
  Triangle,
  User,
  List,
} from 'react-feather'

import Header from './styles/Header'
import useUser from '../lib/useUser'

export default ({ title }) => {
  const user = useUser()
  return (
    <Header>
      <h1>
        <Triangle />
        <span>{title}</span>
      </h1>
      {user?.email && (
        <>
          <span>{user.email}</span>
          <Link href="/notes">
            <a>
              <List />
            </a>
          </Link>
          <Link href="/account">
            <a>
              <User />
            </a>
          </Link>
          <Link href="/api/auth/logout">
            <a>
              <LogOut />
            </a>
          </Link>
        </>
      )}
    </Header>
  )
}
