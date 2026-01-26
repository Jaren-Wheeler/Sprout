# Sprout API Reference

## Authentication

Base path: /api/auth


---

### POST /register
Create a new user account.

**Request Body**

```json
{
  "email": "string",
  "password": "string"
}
```
### Response

```json
{
  "id": "uuid",
  "email": "string",
  "createdAt": "timestamp"
}
```
### Errors
- Email already in use 

### POST /login

```json
{
  "email": "string",
  "password": "string"
}
```

### Response

```json
{
  "id": "uuid",
  "email": "string",
  "createdAt": "timestamp"
}
```

### Errors 
- Invalid Credentials