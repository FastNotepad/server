# server

Fast Notepad Server

# API Document

## Authorization

### \[POST] /api/authorize

#### Description

Authorize and get JWT.

#### Request body

|Name|Description|
|:---:|:---:|
|password|Login password|

#### Response

##### 200

```json
{
	"status": 200,
	"msg": "Success",
	"token": "JWT token"
}
```

```json
{
	"status": 400,
	"msg": "Wrong password"
}
```

##### 400

Invalid request

### \[PUT] /api/authorize

#### Description

Refresh JWT.

#### Response

##### 200

```json
{
	"token": "JWT token"
}
```

## Collections

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
	"id": 000
}
```

##### 400

Invalid request

##### 500

Database error

### \[GET] /api/collection

#### Description

Get all collections.

#### Response

##### 200

```json
[
	{
		"id": 000,
		"name": "Collection name"
	},
	...
]
```

##### 400

Invalid request

##### 500

Database error

### \[PUT] /api/collection

#### Description

Update collection.

#### Request body

|Name|Description|
|:---:|:---:|
|id|Collection ID|
|name|Collection name|

#### Response

##### 204

OK

##### 400

Invalid request

##### 500

Database error

### \[DELETE] /api/collection

#### Description

Delete collection.

#### Request query

|Name|Description|
|:---:|:---:|
|id|Collection ID|

#### Response

##### 204

OK

##### 400

Invalid request

##### 500

Database error

## Notes

### \[POST] /api/note

#### Description

Create note.

#### Request body

|Name|Description|
|:---:|:---:|
|title|Note title|
|contents|Note contents|

#### Response

##### 200

```json
{
	"id": 000
}
```

##### 400

Invalid request

##### 500

Database error

### \[GET] /api/note

#### Description

Get note info by note ID/collection/title.

#### Request query

|Name|Description|
|:---:|:---:|
|id?|Note ID|
|collection?|Collection ID, 0 as null|
|title?|Note title|

#### Response

##### 200

For note ID:

```json
{
	"id": 000,
	"collection": 000,
	"title": "Note title",
	"modify_at": "Modify time",
	"contents": "Note contents"
}
```

For others:

```json
[
	{
		"id": 000,
		"title": "Note title"
	},
	...
]
```

##### 400

Invalid request

##### 404

Note ID not found

##### 500

Database error

### \[PATCH] /api/note

#### Description

Update note.

#### Request body

|Name|Description|
|:---:|:---:|
|id|Note ID|
|collection?|Collection ID, 0 as null|
|title?|Note title|
|contents?|Note contents|

#### Response

##### 204

OK

##### 400

Invalid request

##### 500

Database error

### \[DELETE] /api/note

#### Description

Delete note.

#### Request query

|Name|Description|
|:---:|:---:|
|id|Note ID|

#### Response

##### 204

OK

##### 400

Invalid request

##### 500

Database error
