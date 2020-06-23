import { string, node } from 'prop-types'
import Head from 'next/head'
import { Normalize } from 'styled-normalize'

import Notification from './Notification'
import Layout from './styles/Layout'
import Global from './styles/Global'

const DEFAULT_TITLE = 'notes'

const Page = ({ title, children, ...layoutOptions }) => (
  <Layout {...layoutOptions}>
    <Head>
      <title>
        {title === DEFAULT_TITLE ? title : `${title} - ${DEFAULT_TITLE}`}
      </title>
    </Head>
    <Normalize />
    <Global />
    <Notification />
    {children}
  </Layout>
)

Page.propTypes = {
  title: string,
  children: node.isRequired,
}

Page.defaultProps = {
  title: DEFAULT_TITLE,
}

export default Page
