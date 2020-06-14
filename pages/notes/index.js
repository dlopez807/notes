import Page from '../../components/Page'
import Header from '../../components/Header'
import Notes from '../../components/Notes'

export default () => {
  const title = 'my notes'
  return (
    <Page title={title}>
      <Header title={title} />
      <Notes />
    </Page>
  )
}
