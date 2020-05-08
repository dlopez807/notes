import { useState } from 'react'
import { Copy, Scissors, Save, Download, Command, X } from 'react-feather'

import Footer from './styles/Footer'

export default ({ open, toggleOpen, copy, cut }) => (
  <footer>
    <ul>
      <li>
        <button type="button" onClick={copy}>
          <Copy />
        </button>
      </li>
      <li>
        <button type="button" onClick={cut}>
          <Scissors />
        </button>
      </li>
      <li>
        <button type="button" onClick={copy}>
          <Download />
        </button>
      </li>
    </ul>
    <button type="button" onClick={toggleOpen}>
      {open ? <X /> : <Command />}
    </button>
  </footer>
)
