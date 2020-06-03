import { useState } from 'react'

import useLocalStorage from './useLocalStorage'
import themes from '../components/styles/themes'

export default () => {
  const [customTheme, setCustomTheme] = useLocalStorage('theme', 'cobalt')
  const custom = customTheme || 'default'
  const [theme, setTheme] = useState({ ...themes.default, ...themes[custom] })
  const updateTheme = newTheme => {
    setCustomTheme(newTheme || 'default')
    setTheme({ ...themes.default, ...themes[newTheme] })
  }
  return { ...theme, updateTheme }
}
