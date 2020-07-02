import { useState, useEffect, useMemo, useRef } from 'react'

const isObject = a => typeof a === 'object' && a !== null
const isEqual = (a, b) =>
  isObject(a) && isObject(b) && Object.keys(a).every(key => a[key] === b[key])
const isEmpty = obj => {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

export default props => {
  const { onSubmit, validate } = props
  const initialValuesRef = useRef(props.initialValues)
  const initialErrors = {}
  const [values, setValues] = useState(props.initialValues)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setSubmitting] = useState(false)

  useEffect(
    () => {
      if (!isEqual(initialValuesRef.current, props.initialValues))
        initialValuesRef.current = props.initialValues
    },
    [props.initialValues]
  )

  const dirty = useMemo(() => !isEqual(initialValuesRef.current, values), [
    initialValuesRef.current,
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
      setValues(initialValuesRef.current)
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
