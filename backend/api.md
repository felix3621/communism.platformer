# Api endpoints (/api)

## `/account`

### post `/setDisplayName`
#### Parameters:
- display_name: The new displayname, which the account should use
#### Errors:
- 500: `display_name` not provided, or is not a string
#### Returns:
- (string) New displayname

### post `/setPassword`
#### Parameters:
- password: The current password
- newPassword: The new password
#### Errors
- 401: `password` is not the current password
- 500: `password` or `newPassword` is not provided, or is not a string
#### Returns:
- "Password Changed Successfully"

### post `/login`
#### Parameters (not required):
- username: Username of the account
- password: Password of the account
#### Errors:
- 401: Provided credentials invalid / cookie invalid / credentials not provided or not string
#### Returns:
- user-object:
    - username
    - display_name

### post `/signup`
#### Parameters:
- username
- password
- display_name
#### Errors:
- 403: `username` is already taken
- 500: `username` or `password` or `display_name` is not provided, or not string
#### Returns:
- user-object:
    - username
    - display_name

### post `/logout`

## `/info`

### get `/textures`
Get all textures, with their designated name
#### Returns:
- Object: (name, textureObject)
#### Errors:
- 500: server side error

### get `/textures/:name`
Get texture by name
#### Returns:
- Object: textureObject
#### Errors:
- 500: server side error

### get `/assets`
Get all assets, with their designated name
#### Returns:
- Object: (name, assetsObject)
#### Errors:
- 500: server side error

### get `/assets/:name`
Get asset by name
#### Returns:
- Object: assetsObject
#### Errors:
- 500: server side error

### get `/items`
Get all items, with their designated name
#### Returns:
- Object: (name, itemObject)
#### Errors:
- 500: server side error

### get `/items/:name`
Get item by name
#### Returns:
- Object: itemObject
#### Errors:
- 500: server side error

### get `/class`
Get all classes, with their designated name
#### Returns:
- Object: (name, classObject)
#### Errors:
- 500: server side error

### get `/class/:name`
Get classes by name
#### Returns:
- Object: classObject
#### Errors:
- 500: server side error

### get `/enemy`
Get all enemies, with their designated name
#### Returns:
- Object: (name, enemyObject)
#### Errors:
- 500: server side error

### get `/enemy/:name`
Get enemy by name
#### Returns:
- Object: enemyObject
#### Errors:
- 500: server side error

### get `/map`
Get all maps, with their designated name
#### Returns:
- Object: (name, mapObject)
#### Errors:
- 500: server side error

### get `/map/:name`
Get maps by name
#### Returns:
- Object: mapObject
#### Errors:
- 500: server side error

### post `/`

#### Parameters:
- (object) textures [name, address]
- (object) assets [key, object]
- (object) items [key, object]
- (object) class [key, object]
- (object) enemy [key, object]
- (object) map [key, object]

#### Info:
- if textures is provided, then the provided object is the new list of textures
- (assets, items, class, enemy, map):
    - if the key begins with `new` then it creates a new element
    - if `State` on the object is `change`, then that object gets updated
    - id `State` on the object is `remove`, then the object gets removed

#### Errors:
- 404: A specified key does not exist, some things was updated, but not everything
- 401: You are not an admin

## `/assets`

### post `/:addr`

#### parameters:
- image (NOT JSON-IFIED)

#### errors:
- 500: Something went wrong