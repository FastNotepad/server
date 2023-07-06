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

### \[PATCH] /api/collection

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

## Metas

### \[GET] /api/meta/notes/{collectionId}

#### Description

Get notes by collection ID.

#### Request params

|Name|Description|
|:---:|:---:|
|collectionId|Collection ID, 0 as null|

#### Response

##### 200

```json
{
	"status": 200,
	"msg": "Success",
	"data": [
		{
			"note_id": 000,
			"title": "Note title"
		},
		...
	]
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

### \[GET] /api/meta/notes/{collectionId}

#### Description

Get collections by parent collection ID.

#### Request params

|Name|Description|
|:---:|:---:|
|collectionId|Parent collection ID, 0 as null|

#### Response

##### 200

```json
{
	"status": 200,
	"msg": "Success",
	"data": [
		{
			"collection_id": 000,
			"name": "Collection name"
		},
		...
	]
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

## Notes

### \[GET] /api/note/{noteId}

#### Description

Get note info by note ID.

#### Request params

|Name|Description|
|:---:|:---:|
|noteId|Note ID|

#### Response

##### 200

```json
{
	"status": 200,
	"msg": "Success",
	"data": {
		"title": "Note title",
		"modify_at": "Datetime string",
		"contents": "Markdown contents"
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
	"status": 200,
	"msg": "Success",
	"noteId": 000
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

### \[PATCH] /api/note

#### Description

Update note.

#### Request body

|Name|Description|
|:---:|:---:|
|noteId|Note ID|
|title?|Note title|
|contents?|Note contents|
|collectionId?|Note's collection ID, 0 as null|

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

### \[DELETE] /api/note

#### Description

Delete note.

#### Request body

|Name|Description|
|:---:|:---:|
|noteId|Note ID|

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
