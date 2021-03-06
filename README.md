# <a href='https://5no.io'><img src='https://5no.io/img/5no-small-logo.png' height='100' alt='5no Logo' aria-label='5no.io' /></a>Node.js ORM for Postgres

Node.js ORM for Postgres

## Install

@5no/pg-model requires Node version 8 or above.

```sh
npm install --save @5no/pg-model
```

## .env

```js
DATABASE_URL=postgres://test:123123@127.0.0.1:5432/testDB?ssl=false
DATABASE_QUERY_LOG=true
```

## Schema

[@5no/schema](https://www.npmjs.com/package/@5no/schema)

```js
    {
      table: {
        schema: 'public', //database schema name
        name: 'users', //table name
      },
      columns: { // describe columns 
        [name]: { // column name
          type: String, // String, Number, Boolean, Date, Object, Array, Function
          primaryKey: true, // only for primaryKey
          defaultValue: null, // default value
          required: true, // validate values
          prefilled: true, // filling field by default
          schema: {}, // Can describe object schema
          fn: () => null, // Describe a function for function type
        },
        [name]: { // Auto filling column name
          type: Date,
          created: true, // Fill in create moment
          format: 'YYYY-MM-DD HH:mm:ss', // Format date
        },
        [name]: { // Auto filling column name
          type: Date,
          updated: true, // Fill in update moment
          format: 'YYYY-MM-DD HH:mm:ss', // Format date
        },
      },
      relations: {
        Info: { // name 
          model: UsersInfo, // model 
          join: {
            model: Roles, // Join model
            local: 'role_id', // local column
            foreign: 'id', // external table field
            type: 'one', // one, many
          }, // join model
          local: 'id', // local column
          foreign: 'user_id', // external table field
          type: 'one', // one, many, join
          cascade: [ // cascade methods "save", "delete"
            'save',
            'delete',
          ],
        }
      }
    }
```

## Model Methods

```js
async set(name, value) // setter value
async get(name, value) // getter value
async save(transactionMode = true, allSave = false) // save changes
async join(data) // join another model
async setJSON(data) // set changes by JSON
async saveByJSON(data) // Save changes by JSON
async delete() // Delete entries
async toJSON() // Return to JSON format
```


## Manager.build(model, json = false) 

Builder uses [@5no/pg-builder](https://www.npmjs.com/package/@5no/pg-builder)

```js
builder() // get a Builder for customing query
find(...values) // get one row by primary keys
findOne(field | [...fields], value | [...values]) // get one row by filter
findAll(field | [...fields], value | [...values], order = null, limit = null) // get all rows by filter
count(field | [...fields], value | [...values]) // get count rows
```

## Model Relations Type "many" Methods

```js
await add(data = {}) // Model data JSON
fetch(field | [...fields], value | [...values]) // get rows by filter
fetchOne(field | [...fields], value | [...values]) // get row by filter
```

## Model Relations Type "join" Methods

```js
await join(data) // Model data | Json | ID
fetch(field | [...fields], value | [...values]) // get rows by filter if type many
fetchOne(field | [...fields], value | [...values]) // get row by filter if type many
```

## Examples

```js
const { Manager, Model } = require('@5no/pg-model')


class Roles extends Model {
  static schema = {
    table: {
      schema: 'public',
      name: 'roles',
    },
    columns: {
      id: {
        type: String,
        primaryKey: true,
        defaultValue: null,
      },
      role: {
        type: String,
        defaultValue: null,
      },
      created_at: {
        type: Date,
        created: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      updated_at: {
        type: Date,
        updated: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    relations: {},
  }
}

class Settings extends Model {
  static schema = {
    table: {
      schema: 'public',
      name: 'settings',
    },
    columns: {
      id: {
        type: String,
        primaryKey: true,
        defaultValue: null,
      },
      name: {
        type: String,
        defaultValue: null,
      },
      created_at: {
        type: Date,
        created: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
      updated_at: {
        type: Date,
        updated: true,
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    relations: {},
  }
}

class UserRoles extends Model {
  static schema = {
    table: {
      schema: 'public',
      name: 'user_roles',
    },
    columns: {
      user_id: {
        type: String,
        defaultValue: null,
        primaryKey: true,
      },
      role_id: {
        type: String,
        defaultValue: null,
        primaryKey: true,
      },
    },
    relations: {},
  }
}

class UserSetting extends Model {
  static schema = {
    table: {
      schema: 'public',
      name: 'user_setting',
    },
    columns: {
      user_id: {
        type: String,
        defaultValue: null,
        primaryKey: true,
      },
      setting_id: {
        type: String,
        defaultValue: null,
        primaryKey: true,
      },
    },
    relations: {},
  }
}

class UsersAddresses extends Model {
    static schema = {
      table: {
        schema: 'public',
        name: 'users_address',
      },
      columns: {
        id: {
          type: String,
          primaryKey: true,
          defaultValue: null,
        },
        user_id: {
          type: String,
          defaultValue: null,
          required: true,
        },
        street_name: {
          type: String,
          defaultValue: null,
        },
        postcode: {
          type: String,
          defaultValue: null,
        },
        created_at: {
          type: Date,
          created: true,
          format: 'YYYY-MM-DD HH:mm:ss',
        },
        updated_at: {
          type: Date,
          updated: true,
          format: 'YYYY-MM-DD HH:mm:ss',
        },
      },
      relations: {},
    }
}

class UsersInfo extends Model {
    static schema = {
      table: {
        schema: 'public',
        name: 'users_info',
      },
      columns: {
        id: {
          type: String,
          primaryKey: true,
          defaultValue: null,
        },
        user_id: {
          type: String,
          defaultValue: null,
          required: true,
        },
        first_name: {
          type: String,
          defaultValue: null,
        },
        last_name: {
          type: String,
          defaultValue: null,
        },
        created_at: {
          type: Date,
          created: true,
          format: 'YYYY-MM-DD HH:mm:ss',
        },
        updated_at: {
          type: Date,
          updated: true,
          format: 'YYYY-MM-DD HH:mm:ss',
        },
      },
      relations: {},
    }
}

class Users extends Model {
    static schema = {
      table: {
        schema: 'public',
        name: 'users',
      },
      columns: {
        id: {
          type: String,
          primaryKey: true,
          defaultValue: null,
        },
        email: {
          type: String,
          required: true,
        },
        public_key: {
          type: String,
          required: true,
        },
        secret_key: {
          type: String,
          defaultValue: '',
          required: true,
        },
        personalised: {
          type: Object,
          prefilled: true,
          defaultValue: {
            test: 100,
          },
        },
        properties: {
          type: Array,
          defaultValue: [],
          schema: {
            name: {
              type: String,
              required: true,
              filters: [
                'lowerCase',
              ],
            },
            value: {
              type: String,
              required: true,
            },
          },
        },
        countRoles: {
          type: Function,
          fn: (model) => model.getCountRoles(),
        },
        created_at: {
          type: Date,
          created: true,
          format: 'YYYY-MM-DD HH:mm:ss',
        },
        updated_at: {
          type: Date,
          updated: true,
          format: 'YYYY-MM-DD HH:mm:ss',
        },
      },
      relations: {
        Info: {
          model: UsersInfo,
          local: 'id',
          foreign: 'user_id',
          type: 'one',
          cascade: [
            'save',
            'delete',
          ],
        },
        Addresses: {
          model: UsersAddresses,
          local: 'id',
          foreign: 'user_id',
          type: 'many',
          cascade: [
            'save',
            'delete',
          ],
        },
        Roles: {
          model: UserRoles,
          join: {
            model: Roles,
            local: 'role_id',
            foreign: 'id',
            type: 'many',
          },
          local: 'id',
          foreign: 'user_id',
          type: 'join', 
          cascade: [
            'save',
            'delete',
          ],
        },
        Setting: {
          model: UserSetting,
          join: {
            model: Settings,
            local: 'setting_id',
            foreign: 'id',
            type: 'one',
          },
          local: 'id',
          foreign: 'user_id',
          type: 'join', 
          cascade: [
            'save',
            'delete',
          ],
        },
      },
    }

    getCountRoles = () => Manager.build(UserRoles).count('user_id', this.id)
}
```

CREATE NEW ENTRY

```js
const roleModel = new Roles()
roleModel.role = 'Admin'
await roleModel.save()

const settingModel = new Settings()
settingModel.name = 'AdminSetting'
await settingModel.save()

const testNewUser = new Users()

testNewUser.email = 'test@test.me'
testNewUser.public_key = 'test_123'
testNewUser.secret_key = 'test_333'
   
testNewUser.properties = [
        {
          name: 'Test',
          value: 'OK',
        },
      ]  

await testNewUser.Addresses.add({
  street_name: 'Test',
  postcode: '100500',
})
await testNewUser.Addresses.add({
  street_name: 'Test1',
  postcode: '100502',
})

testNewUser.Info.first_name = 'Aleks2'
testNewUser.Info.last_name = 'Sokol2'

await testNewUser.Roles.join(roleModel.id)

await testNewUser.Setting.join(settingModel)

const returnData = await testNewUser.save()

/* 
If all correct function return boolean "true" otherwise array errors
Error: [
        'duplicate key value violates unique constraint "users_email_index"',
      ]
*/

```


BUILDER 

[@5no/pg-builder](https://www.npmjs.com/package/@5no/pg-builder)

```js
const builder = await Manager.build(Users).builder()

builder.select().where('id', '=', usersNewId)

const data = await builder.rows()
```


GET 

```js
const dataJson = await Manager.build(Users, true).find(usersId)
```

return

```js
{ 
  id: '7852468e-ac99-4f5e-9ee3-d506b0c4424e',
  secret_key: 'test_333',
  email: 'test@test.me',
  public_key: 'test_123',
  countRoles: 1,
  created_at: '2018-12-20 17:10:31',
  updated_at: '2018-12-20 17:10:31',
  personalised: {
    test: 100
  },
  properties: [
    {
      name: 'test',
      value: 'OK',
    },
  ],
  Info: 
   { id: '0320dc4f-4ca7-4b65-bd42-52f286a0b9db',
     user_id: '7852468e-ac99-4f5e-9ee3-d506b0c4424e',
     first_name: 'Aleks2',
     last_name: 'Sokol2',
     created_at: '2018-12-20 17:10:31',
     updated_at: '2018-12-20 17:10:31' },
  Addresses: 
   [ 
     { id: 'be40ccb3-3a33-4b6e-9467-6907b0c4396b',
       user_id: '7852468e-ac99-4f5e-9ee3-d506b0c4424e',
       street_name: 'Test',
       postcode: '100500',
       created_at: '2018-12-20 17:10:31',
       updated_at: '2018-12-20 17:10:31' },
     { id: 'f5bae3e9-290b-451e-a0e2-1ec2d9eaf543',
       user_id: '7852468e-ac99-4f5e-9ee3-d506b0c4424e',
       street_name: 'Test1',
       postcode: '100502',
       created_at: '2018-12-20 17:10:31',
       updated_at: '2018-12-20 17:10:31' } 
    ], 
  Roles: [
    {
      created_at: '2018-12-20 17:10:31',
      id: 'be40ccb3-3a33-4b6e-9467-6907b0c4396b',
      role: 'Admin',
      updated_at: '2018-12-20 17:10:31'
    }
  ],
  Setting: {
    created_at: '2018-12-20 17:10:31',
    id: 'be40ccb3-3a33-4b6e-9467-6907b0c4396b',
    name: 'AdminSetting',
    updated_at: '2018-12-20 17:10:31'
  }
}
```

UPDATE

```js
let data = await Manager.build(Users).find(usersId)

let oneAddresses = data.Addresses.fetchOne('street_name', 'Test1')
oneAddresses.postcode = '100508'

data.Info.last_name = 'Sokol200'
data.secret_key = 'test_33309'

await data.save()

```


SAVE BY JSON

```js
const testNewUser = new Users()

const newData = {
        email: 'test2010@test.me',
        public_key: 'test_123',
        secret_key: 'test_333',
        personalised: {
          test: 100,
        },
        Addresses: [{
          street_name: 'Test 100',
          postcode: '100501',
        }],
        Roles: [ await adminRole.toJSON() ],
}

const returnData = await testNewUser.saveByJSON(newData)

```


DELETE

```js
let data = await Manager.build(Users).find(usersId)
await data.delete()

/* 
If all correct function return boolean "true" otherwise array errors
*/
```

DELETE ONE ITEM FROM RELATE

```js
let data = await Manager.build(Users).find(usersId)
let dataDel = data.Roles.fetchOne('role', 'Admin')
await dataDel.delete()
```

## License

MIT Licensed, Copyright (c) 2018 Aleksandr Sokol