import Page from '../components/Page'
import Header from '../components/Header'
import Account from '../components/Account'

export default () => {
  const title = 'my account'
  return (
    <Page title={title}>
      <Header title={title} />
      <main>
        <Account />
      </main>
    </Page>
  )
}
