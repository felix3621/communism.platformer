# Api endpoints (/api)

## /account

### post /setDisplayName
#### Parameters:
- display_name: The new displayname, which the account should use
#### Errors:
- 500: `display_name` not provided, or is not a string
#### Returns:
- (string) New displayname

### post /setPassword
#### Parameters:
- password: The current password
- newPassword: The new password
#### Errors
- 401: `password` is not the current password
- 500: `password` or `newPassword` is not provided, or is not a string
#### Returns:
- "Password Changed Successfully"

### post /login
#### Parameters (not required):
- username: Username of the account
- password: Password of the account
#### Errors:
- 401: Provided credentials invalid / cookie invalid / credentials not provided or not string
#### Returns:
- user-object:
    - username
    - display_name

### post /signup
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

### post /logout

## /info

### get /textures
Get all textures, with their designated name
#### Returns:
- Object: (name, texture)
#### Errors:
- 500: server side error

### get /textures/:name
Get texture by name
#### Returns:
- String (texture)
#### Errors:
- 500: server side error

### get /assets
Get all assets, with their designated name
#### Returns:
- Object: (name, {(string) Description, (int) Height, (int) Width, (string) Texture})
#### Errors:
- 500: server side error

### get /assets/:name
Get asset by name
#### Returns:
- Object: {(string) Description, (int) Height, (int) Width, (string) Texture}
#### Errors:
- 500: server side error

### get /tools
Get all tools, with their designated name
#### Returns:
- Object: (name, {(string) Description, (string) Texture})
#### Errors:
- 500: server side error

### get /tools/:name
Get asset by name
#### Returns:
- Object: {(string) Description, (string) Texture}
#### Errors:
- 500: server side error