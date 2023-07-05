# server

Fast Notepad Server

# API Document

## Authorization

### \[POST] /api/login

#### Description

Login and get JWT.

#### Request body

|Name|Description|
|:---:|:---:|
|password|Login password|

#### Response

##### 200

```json
{
	"status": 200,
	"msg": "Success"
}
```

```json
{
	"status": 400,
	"msg": "Wrong password"
}
```

##### 400

Invalid request body

## Collections

### \[GET] /api/collection/{collectionId}

#### Description

Get collection info by collection ID.

#### Request params

|Name|Description|
|:---:|:---:|
|collectionId|Collection ID|

#### Response

##### 200

```json
{
	"status": 200,
	"msg": "Success",
	"data": {
		"parent_collection_id": 000,
		"name": "Collection name"
	}
}
```

```json
{
	"status": 400,
	"msg": "Collection not found"
}
```

```json
{
	"status": 500,
	"msg": "Database error"
}
```

##### 400

Invalid request body

### \[POST] /api/collection

#### Description

Create collection.

#### Request body

|Name|Description|
|:---:|:---:|
|name|Collection name|

#### Response

##### 200

```json
{
	"status": 200,
	"msg": "Success",
	"collectionId": 000
}
```

```json
{
	"status": 500,
	"msg": "Database error"
}
```

##### 400

Invalid request body

### \[PUT] /api/collection

#### Description

Update collection.

#### Request body

|Name|Description|
|:---:|:---:|
|collectionId|Collection ID|
|name?|Collection name|
|parentId?|Parent collection ID, 0 as null|

#### Response

##### 200

```json
{
	"status": 200,
	"msg": "Success"
}
```

```json
{
	"status": 500,
	"msg": "Database error"
}
```

##### 400

Invalid request body

### \[DELETE] /api/collection

#### Description

Delete collection.

#### Request body

|Name|Description|
|:---:|:---:|
|collectionId|Collection ID|

#### Response

##### 200

```json
{
	"status": 200,
	"msg": "Success"
}
```

```json
{
	"status": 500,
	"msg": "Database error"
}
```

##### 400

Invalid request body