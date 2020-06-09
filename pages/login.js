import Link from 'next/link'
import { X } from 'react-feather'

import Page from '../components/Page'
import Login from '../components/Login'
import Footer from '../components/styles/Footer'

export default () => (
  <Page title="login">
    <main>
      <Login />
      <Footer>
        <ul>
          <li>
            <Link href="/">
              <a>
                <X />
              </a>
            </Link>
          </li>
        </ul>
      </Footer>
    </main>
  </Page>
)
