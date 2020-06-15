import { useState, useMemo } from 'react'

const isObject = a => typeof a === 'object' && a !== null
const isEqual = (a, b) =>
  isObject(a) && isObject(b) && Object.keys(a).every(key => a[key] === b[key])
const isEmpty = obj => {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

export default ({ initialValues, onSubmit, validate }) => {
  const initialErrors = {}
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
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
    const newErrors = validate ? validate(values) : initialErrors
    if (!isEmpty(newErrors)) {
      setErrors(newErrors)
      setSubmitting(false)
    } else {
      setErrors(initialErrors)
      await onSubmit(values, { setSubmitting, setErrors })
      setValues(initialValues)
    }
  }

  return {
    values,
    handleChange,
    handleSubmit,
    isSubmitting,
    dirty,
    errors,
  }
}
