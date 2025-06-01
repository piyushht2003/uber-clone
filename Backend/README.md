# User Registration Endpoint Documentation

## Endpoint

`POST /users/register`

## Description

Registers a new user in the system. This endpoint validates the input, hashes the password, creates a user, and returns a JWT token upon successful registration.

## Request Body

The request body must be a JSON object with the following structure:

```
{
  "fullname": {
    "firstname": "<First Name>",
    "lastname": "<Last Name>" // Optional, but if provided, must be at least 3 characters
  },
  "email": "<user@example.com>",
  "password": "<password>"
}
```

### Field Requirements
- `fullname.firstname`: Required, string, minimum 3 characters
- `fullname.lastname`: Optional, string, minimum 3 characters if provided
- `email`: Required, must be a valid email address
- `password`: Required, string, minimum 6 characters

## Responses

### Success
- **Status Code:** `201 Created`
- **Body:**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "_id": "<userId>",
      "fullname": {
        "firstname": "<First Name>",
        "lastname": "<Last Name>"
      },
      "email": "<user@example.com>"
      // other user fields (password is not returned)
    },
    "token": "<JWT Token>"
  }
  ```

### Validation Error
- **Status Code:** `400 Bad Request`
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "<Validation error message>",
        "param": "<field>",
        "location": "body"
      }
    ]
  }
  ```

### Example Request

```
POST /users/register
Content-Type: application/json

{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Example Success Response

```
Status: 201 Created
{
  "message": "User registered successfully",
  "user": {
    "_id": "60d0fe4f5311236168a109ca",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  },
  "token": "<JWT Token>"
}
```

---

---

# User Login Endpoint Documentation

## Endpoint

`POST /users/login`

## Description

Authenticates a user with email and password. Returns a JWT token and user data if credentials are valid.

## Request Body

The request body must be a JSON object with the following structure:

```
{
  "email": "<user@example.com>",
  "password": "<password>"
}
```

### Field Requirements
- `email`: Required, must be a valid email address
- `password`: Required, string, minimum 6 characters

## Responses

### Success
- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "message": "Login successful",
    "user": {
      "_id": "<userId>",
      "fullname": {
        "firstname": "<First Name>",
        "lastname": "<Last Name>"
      },
      "email": "<user@example.com>"
      // other user fields (password is not returned)
    },
    "token": "<JWT Token>"
  }
  ```

### Invalid Credentials
- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Invalid email or password"
  }
  ```

### Validation Error
- **Status Code:** `400 Bad Request`
- **Body:**
  ```json
  {
    "errors": [
      {
        "msg": "<Validation error message>",
        "param": "<field>",
        "location": "body"
      }
    ]
  }
  ```

### Example Request

```
POST /users/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### Example Success Response

```
Status: 200 OK
{
  "message": "Login successful",
  "user": {
    "_id": "60d0fe4f5311236168a109ca",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  },
  "token": "<JWT Token>"
}
```

---


---

# User Profile Endpoint Documentation

## Endpoint

`POST /users/profile`

## Description

Returns the authenticated user's profile. Requires a valid JWT token in the request (sent via cookies or `Authorization` header as `Bearer <token>`).

## Authentication

- This endpoint is protected. You must provide a valid JWT token.

## Request

- No body is required. The token must be sent in cookies or the `Authorization` header.

## Responses

### Success
- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "_id": "<userId>",
    "fullname": {
      "firstname": "<First Name>",
      "lastname": "<Last Name>"
    },
    "email": "<user@example.com>"
    // other user fields
  }
  ```

### Unauthorized
- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Unauthorized"
  }
  ```

### Example Request

```
POST /users/profile
Authorization: Bearer <JWT Token>
```

### Example Success Response

```
Status: 200 OK
{
  "_id": "60d0fe4f5311236168a109ca",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com"
}
```

---

# User Logout Endpoint Documentation

## Endpoint

`POST /users/logout`

## Description

Logs out the user by blacklisting the current JWT token. Requires a valid JWT token in the request (sent via cookies or `Authorization` header as `Bearer <token>`).

## Authentication

- This endpoint is protected. You must provide a valid JWT token.

## Request

- No body is required. The token must be sent in cookies or the `Authorization` header.

## Responses

### Success
- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "message": "Logout successful"
  }
  ```

### Unauthorized
- **Status Code:** `401 Unauthorized`
- **Body:**
  ```json
  {
    "message": "Unauthorized"
  }
  ```

### Example Request

```
POST /users/logout
Authorization: Bearer <JWT Token>
```

### Example Success Response

```
Status: 200 OK
{
  "message": "Logout successful"
}
```

---


---

# Captain Endpoints Documentation

## Register Captain

**Endpoint:** `POST /captains/register`

**Request Body:**
```jsonc
{
  "fullname": {
    "firstname": "John", // Required, min 3 chars
    "lastname": "Doe"    // Optional, min 3 chars if provided
  },
  "email": "captain@example.com", // Required, must be a valid email
  "password": "password123",      // Required, min 6 chars
  "vehicle": {
    "color": "Red",               // Required, min 3 chars
    "plate": "ABC123",            // Required, min 3 chars, unique
    "capacity": 4,                 // Required, integer >= 1
    "vehicleType": "car"          // Required, one of: 'car', 'motorcycle', 'auto'
  }
}
```

**Success Response:**
```jsonc
{
  "message": "Captain registered successfully",
  "captain": {
    "_id": "<captainId>",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "captain@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
    // other fields
  },
  "token": "<JWT Token>"
}
```

**Validation Error Response:**
```jsonc
{
  "errors": [
    {
      "msg": "<Validation error message>",
      "param": "<field>",
      "location": "body"
    }
  ]
}
```

---

## Captain Login

**Endpoint:** `POST /captains/login`

**Request Body:**
```jsonc
{
  "email": "captain@example.com", // Required, must be a valid email
  "password": "password123"       // Required, min 6 chars
}
```

**Success Response:**
```jsonc
{
  "message": "Captain logged in successfully",
  "captain": {
    "_id": "<captainId>",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "captain@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
    // other fields
  },
  "token": "<JWT Token>"
}
```

**Invalid Credentials Response:**
```jsonc
{
  "message": "Invalid email or password"
}
```

**Validation Error Response:**
```jsonc
{
  "errors": [
    {
      "msg": "<Validation error message>",
      "param": "<field>",
      "location": "body"
    }
  ]
}
```

---

## Captain Logout

**Endpoint:** `POST /captains/logout`

**Headers:**
  - Requires a valid JWT token in cookies or `Authorization: Bearer <token>`

**Success Response:**
```jsonc
{
  "message": "Captain logged out successfully"
}
```

**Unauthorized Response:**
```jsonc
{
  "message": "Unauthorized"
}
```

---

For any issues or questions, please contact the backend team.
