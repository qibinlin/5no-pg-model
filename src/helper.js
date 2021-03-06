import Builder from '@5no/pg-builder'

const transaction = {
  begin: Builder.begin,
  commit: Builder.commit,
  rollback: Builder.rollback,
}

const getBuilder = (schema, handler) => {
  const db = Builder.build(
    {
      table: schema.table,
      schema: schema.schema,
      rowsHandler: handler,
    }
  ).returning()

  return db
}

const getTypeName = (type) => {
  let typeName = null
  if (typeof type === 'string') {
    typeName = type.toLowerCase()
  } else {
    typeName = type.name.toString().toLowerCase()
  }

  return typeName
}

const getTypeOfValue = (value) => {
  let typeOfValue = typeof value

  if (typeOfValue === 'object' && value !== null) {
    typeOfValue = value.constructor.name.toLowerCase()
  }

  return typeOfValue
}

const modelSchemaFormater = (columns) => {
  let returnFormat = {}
  let returnFunctionFormat = {}
  let primaryKeyFields = []
  let createdField = null
  let updatedField = null
  let sortFields = []
  Object.keys(columns).forEach((field) => {
    const { type, defaultValue, required, prefilled, schema, filters, validators, primaryKey, format, fn, created, updated } = columns[field]

    sortFields.push(field)

    if (primaryKey) {
      primaryKeyFields.push(field)
    }

    if (getTypeName(type) === 'date' && created === true) {
      createdField = field
    }

    if (getTypeName(type) === 'date' && updated === true) {
      updatedField = field
    }

    if (getTypeName(type) === 'function') {
      returnFunctionFormat[field] = fn
    } else {
      returnFormat[field] = {
        type: type,
        defaultValue: defaultValue,
        schema: schema,
        format: format,
        prefilled: prefilled || false,
        required: required || false,
        filters: filters || [],
        validators: validators || [],
      }
    }
  })

  return {
    primaryKeyFields: primaryKeyFields,
    createdField: createdField,
    updatedField: updatedField,
    returnFormat: returnFormat,
    returnFunctionFormat: returnFunctionFormat,
    sortFields: sortFields,
  }
}

const modelSchemaRelationsFormater = (relations) => {
  let relationsData = []
  Object.keys(relations).forEach((name) => {
    const {model, foreign, local, type, cascade, join} = relations[name]
    relationsData.push({
      name: name,
      model: model,
      foreign: foreign,
      local: local,
      type: type,
      join: join || {},
      cascade: cascade || [],
    })
  })

  return relationsData
}

const errors = (errors) => {
  const type = getTypeOfValue(errors)
  if (type === 'object') {
    return errors
  }

  return { error: typeof errors.message !== 'undefined' ? errors.message : errors }
}

const resolveFn = (fn, model) => new Promise((resolve, reject) => {
  return Promise.resolve(fn(model)).then(resolve).catch(reject)
})

module.exports = {
  errors,
  getBuilder,
  getTypeName,
  getTypeOfValue,
  modelSchemaFormater,
  modelSchemaRelationsFormater,
  resolveFn,
  transaction,
}
