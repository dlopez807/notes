import App from 'next/app'
import 'react-toastify/dist/ReactToastify.min.css'

import Theme from '../components/Theme'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <Theme>
        <Component {...pageProps} />
      </Theme>
    )
  }
}

export default MyApp
