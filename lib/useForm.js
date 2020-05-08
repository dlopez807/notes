import { useState, useMemo } from 'react'

const isObject = a => typeof a === 'object' && a !== null
const isEqual = (a, b) =>
  isObject(a) && isObject(b) && Object.keys(a).every(key => a[key] === b[key])

export default ({ initialValues, onSubmit }) => {
  const [values, setValues] = useState(initialValues)
  const [isSubmitting, setSubmitting] = useState(false)

  const dirty = useMemo(() => !isEqual(initialValues, values), [
    initialValues,
    values,
  ])

  const handleChange = e => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: value,
    })
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    await onSubmit(values, { setSubmitting })
  }

  return {
    values,
    handleChange,
    handleSubmit,
    isSubmitting,
    dirty,
  }
}
