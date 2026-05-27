# 🚗 COVOITURAGE API - COMPLETE ENDPOINTS DOCUMENTATION

**BASE URL:** `http://localhost:3000`

---

## 📋 Table of Contents
1. [Authentication (Auth)](#-authentication-endpoints)
2. [Trips Management](#-trips-endpoints)
3. [Bookings Management](#-bookings-endpoints)
4. [Passenger Alerts](#-alerts-endpoints)
5. [Test Sequence](#-complete-test-sequence)

---

## 🔐 Authentication Endpoints

### 1️⃣ REGISTER - Create New Account

```
METHOD: POST
URL: http://localhost:3000/auth/register
AUTHENTICATION: ❌ Not Required
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+33612345678"
}
```

**Validation Rules:**
- `name`: String, 2-50 characters
- `email`: Valid email format
- `password`: Min 8 chars, must contain uppercase, lowercase, number, and special character (@$!%*?&)
- `phone`: Valid phone number format

**Success Response (200):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+33612345678"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "15m"
}
```

**Error Response (409):**
```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

---

### 2️⃣ LOGIN - Authenticate User

```
METHOD: POST
URL: http://localhost:3000/auth/login
AUTHENTICATION: ❌ Not Required
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "15m"
}
```

**Error Response (401):**
```json
{
  "statusCode": 401,
  "message": "Invalid email or password",
  "error": "Unauthorized"
}
```

---

### 3️⃣ REFRESH TOKEN - Get New Access Token

```
METHOD: POST
URL: http://localhost:3000/auth/refresh
AUTHENTICATION: ❌ Not Required
```

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (NEW)",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (NEW)",
  "expiresIn": "15m"
}
```

---

### 4️⃣ LOGOUT - Revoke Tokens

```
METHOD: POST
URL: http://localhost:3000/auth/logout
AUTHENTICATION: ✅ Required (JWT Token)
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

## 🛣️ Trips Endpoints

> **🔒 All trip endpoints require JWT Authentication**

### 1️⃣ CREATE TRIP - Create New Trip Offer

```
METHOD: POST
URL: http://localhost:3000/trips
AUTHENTICATION: ✅ Required (JWT Token)
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

**Request Body:**
```json
{
  "departure": "Tunis",
  "destination": "Nabeul",
  "date": "2026-06-15",
  "seats": 3,
  "price": 45.50,
  "description": "Comfortable ride with AC, will stop for coffee",
  "carModel": "Toyota Corolla 2020"
}
```

**Validation Rules:**
- `departure`: String (required)
- `destination`: String (required)
- `date`: ISO date string (required)
- `seats`: Integer, minimum 1 (required)
- `price`: Number, minimum 0 (required)
- `description`: String (optional)
- `carModel`: String (optional)

**Success Response (201):**
```json
{
  "id": 1,
  "driverId": 1,
  "departure": "Tunis",
  "destination": "Nabeul",
  "date": "2026-06-15T00:00:00.000Z",
  "seats": 3,
  "price": 45.50,
  "description": "Comfortable ride with AC, will stop for coffee",
  "carModel": "Toyota Corolla 2020",
  "createdAt": "2026-05-26T10:15:00.000Z",
  "status": "active"
}
```

---

### 2️⃣ GET MY TRIPS - List Your Created Trips

```
METHOD: GET
URL: http://localhost:3000/trips/mine
AUTHENTICATION: ✅ Required (JWT Token)
```

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "driverId": 1,
    "departure": "Tunis",
    "destination": "Nabeul",
    "date": "2026-06-15T00:00:00.000Z",
    "seats": 3,
    "price": 45.50,
    "description": "Comfortable ride with AC",
    "carModel": "Toyota Corolla",
    "createdAt": "2026-05-26T10:15:00.000Z",
    "status": "active"
  },
  {
    "id": 2,
    "driverId": 1,
    "departure": "Sfax",
    "destination": "Sousse",
    "date": "2026-06-20T00:00:00.000Z",
    "seats": 2,
    "price": 30.00,
    "description": "Direct route",
    "carModel": "Honda Civic",
    "createdAt": "2026-05-26T10:20:00.000Z",
    "status": "active"
  }
]
```

---

### 3️⃣ UPDATE TRIP - Modify Trip Details

```
METHOD: PUT
URL: http://localhost:3000/trips/:id
AUTHENTICATION: ✅ Required (JWT Token)
```

**URL Parameters:**
- `id`: Trip ID (number)

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

**Request Body (all fields optional):**
```json
{
  "departure": "Tunis",
  "destination": "Bizerte",
  "date": "2026-06-16",
  "seats": 2,
  "price": 50.00,
  "description": "Updated: No stops",
  "carModel": "Toyota Corolla 2020"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "driverId": 1,
  "departure": "Tunis",
  "destination": "Bizerte",
  "date": "2026-06-16T00:00:00.000Z",
  "seats": 2,
  "price": 50.00,
  "description": "Updated: No stops",
  "carModel": "Toyota Corolla 2020",
  "createdAt": "2026-05-26T10:15:00.000Z",
  "updatedAt": "2026-05-26T10:30:00.000Z"
}
```

---

### 4️⃣ DELETE/CANCEL TRIP - Cancel a Trip

```
METHOD: DELETE
URL: http://localhost:3000/trips/:id
AUTHENTICATION: ✅ Required (JWT Token)
```

**URL Parameters:**
- `id`: Trip ID (number)

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

**Success Response (200):**
```json
{
  "message": "Trip cancelled successfully",
  "id": 1
}
```

**Error Response (403):**
```json
{
  "statusCode": 403,
  "message": "You are not the driver of this trip",
  "error": "Forbidden"
}
```

---

## 📦 Bookings Endpoints

> **🔒 All booking endpoints require JWT Authentication**

### 1️⃣ CREATE BOOKING - Book a Trip

```
METHOD: POST
URL: http://localhost:3000/bookings
AUTHENTICATION: ✅ Required (JWT Token)
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

**Request Body:**
```json
{
  "tripId": 1
}
```

**Validation Rules:**
- `tripId`: Positive integer (required)

**Success Response (201):**
```json
{
  "id": 5,
  "tripId": 1,
  "passengerId": 2,
  "status": "pending",
  "createdAt": "2026-05-26T10:45:00.000Z"
}
```

**Error Response (409):**
```json
{
  "statusCode": 409,
  "message": "You have already booked this trip",
  "error": "Conflict"
}
```

---

### 2️⃣ CANCEL BOOKING - Cancel Your Booking

```
METHOD: DELETE
URL: http://localhost:3000/bookings/:id
AUTHENTICATION: ✅ Required (JWT Token)
```

**URL Parameters:**
- `id`: Booking ID (number)

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

**Success Response (200):**
```json
{
  "message": "Booking cancelled successfully",
  "id": 5
}
```

---

### 3️⃣ CONFIRM BOOKING - Driver Confirms Passenger (PATCH)

```
METHOD: PATCH
URL: http://localhost:3000/bookings/:id/confirm
AUTHENTICATION: ✅ Required (JWT Token - Driver Only)
```

**URL Parameters:**
- `id`: Booking ID (number)

**Headers:**
```json
{
  "Authorization": "Bearer DRIVER_ACCESS_TOKEN"
}
```

**Success Response (200):**
```json
{
  "id": 5,
  "tripId": 1,
  "passengerId": 2,
  "status": "confirmed",
  "updatedAt": "2026-05-26T10:50:00.000Z"
}
```

**Error Response (403):**
```json
{
  "statusCode": 403,
  "message": "You are not the driver of this trip",
  "error": "Forbidden"
}
```

---

### 4️⃣ REJECT BOOKING - Driver Rejects Passenger (PATCH)

```
METHOD: PATCH
URL: http://localhost:3000/bookings/:id/reject
AUTHENTICATION: ✅ Required (JWT Token - Driver Only)
```

**URL Parameters:**
- `id`: Booking ID (number)

**Headers:**
```json
{
  "Authorization": "Bearer DRIVER_ACCESS_TOKEN"
}
```

**Success Response (200):**
```json
{
  "id": 5,
  "tripId": 1,
  "passengerId": 2,
  "status": "rejected",
  "updatedAt": "2026-05-26T10:52:00.000Z"
}
```

---

### 5️⃣ GET PENDING BOOKINGS - List Pending Reservations for a Trip

```
METHOD: GET
URL: http://localhost:3000/bookings/trip/:tripId/pending
AUTHENTICATION: ✅ Required (JWT Token - Trip Driver Only)
```

**URL Parameters:**
- `tripId`: Trip ID (number)

**Headers:**
```json
{
  "Authorization": "Bearer DRIVER_ACCESS_TOKEN"
}
```

**Success Response (200):**
```json
[
  {
    "id": 5,
    "tripId": 1,
    "passengerId": 2,
    "status": "pending",
    "passenger": {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "phone": "+33698765432"
    },
    "createdAt": "2026-05-26T10:45:00.000Z"
  },
  {
    "id": 6,
    "tripId": 1,
    "passengerId": 3,
    "status": "pending",
    "passenger": {
      "id": 3,
      "name": "Bob Johnson",
      "email": "bob@example.com",
      "phone": "+33712345678"
    },
    "createdAt": "2026-05-26T10:48:00.000Z"
  }
]
```

---

## 🔔 Alerts Endpoints

> **🔒 All alert endpoints require JWT Authentication**

### 1️⃣ CREATE ALERT - Set Up a Passenger Alert

```
METHOD: POST
URL: http://localhost:3000/alerts
AUTHENTICATION: ✅ Required (JWT Token)
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

**Request Body:**
```json
{
  "departure": "Tunis",
  "destination": "Nabeul",
  "date": "2026-06-01"
}
```

**Validation Rules:**
- `departure`: String (optional)
- `destination`: String (optional)
- `date`: ISO date string (optional)
- At least one field should be provided

**Success Response (201):**
```json
{
  "id": 1,
  "passengerId": 2,
  "departure": "Tunis",
  "destination": "Nabeul",
  "date": "2026-06-01T00:00:00.000Z",
  "createdAt": "2026-05-26T09:13:00.577Z"
}
```

---

### 2️⃣ GET MY ALERTS - List Your Created Alerts

```
METHOD: GET
URL: http://localhost:3000/alerts
AUTHENTICATION: ✅ Required (JWT Token)
```

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "passengerId": 2,
    "departure": "Tunis",
    "destination": "Nabeul",
    "date": "2026-06-01T00:00:00.000Z",
    "createdAt": "2026-05-26T09:13:00.577Z"
  },
  {
    "id": 2,
    "passengerId": 2,
    "departure": "Sfax",
    "destination": "Sousse",
    "date": "2026-06-10T00:00:00.000Z",
    "createdAt": "2026-05-26T09:20:00.000Z"
  }
]
```

---

### 3️⃣ DELETE ALERT - Remove an Alert

```
METHOD: DELETE
URL: http://localhost:3000/alerts/:id
AUTHENTICATION: ✅ Required (JWT Token)
```

**URL Parameters:**
- `id`: Alert ID (number)

**Headers:**
```json
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

**Success Response (200):**
```json
{
  "message": "Alerte supprimée"
}
```

---

## 🏠 General Endpoints

### GET / - Health Check

```
METHOD: GET
URL: http://localhost:3000/
AUTHENTICATION: ❌ Not Required
```

**Success Response (200):**
```
Hello World!
```

---

## 📝 Complete Test Sequence

Follow this sequence to test all functionality:

### **Phase 1: Authentication**
1. ✅ Register a new user (SAVE tokens)
2. ✅ Login with credentials (SAVE tokens)
3. ✅ Refresh token
4. ✅ Logout

### **Phase 2: Trips (as Driver)**
1. ✅ Create a trip
2. ✅ Get your trips (verify created trip)
3. ✅ Update a trip
4. ✅ Keep trip for Phase 3

### **Phase 3: Bookings (as Passenger)**
1. ✅ Register second user (Passenger)
2. ✅ Login as passenger
3. ✅ Create booking on driver's trip
4. ✅ Get pending bookings (switch to driver token)

### **Phase 4: Booking Actions (as Driver)**
1. ✅ Confirm booking
2. ✅ Create another booking (from different passenger)
3. ✅ Reject the second booking

### **Phase 5: Alerts (as Passenger)**
1. ✅ Create an alert
2. ✅ Get your alerts
3. ✅ Delete an alert

### **Phase 6: Cleanup (as Driver)**
1. ✅ Cancel a trip (DELETE)
2. ✅ Logout

---

## 🧪 Testing with PowerShell

### **Example 1: Register & Get Token**
```powershell
$body = @{
  name='Test User'
  email='test@example.com'
  password='Password123!'
  phone='+33612345678'
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://localhost:3000/auth/register' `
  -Method POST `
  -ContentType 'application/json' `
  -Body $body `
  -UseBasicParsing

$token = ($response.Content | ConvertFrom-Json).accessToken
Write-Host "Token: $token"
```

### **Example 2: Create Trip**
```powershell
$body = @{
  departure='Tunis'
  destination='Nabeul'
  date='2026-06-15'
  seats=3
  price=45.50
  description='Comfortable ride'
  carModel='Toyota Corolla'
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://localhost:3000/trips' `
  -Method POST `
  -ContentType 'application/json' `
  -Headers @{'Authorization'="Bearer $token"} `
  -Body $body `
  -UseBasicParsing

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

### **Example 3: Create Booking**
```powershell
$body = @{
  tripId=1
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://localhost:3000/bookings' `
  -Method POST `
  -ContentType 'application/json' `
  -Headers @{'Authorization'="Bearer $token"} `
  -Body $body `
  -UseBasicParsing

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

### **Example 4: Create Alert**
```powershell
$body = @{
  departure='Tunis'
  destination='Nabeul'
  date='2026-06-01'
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://localhost:3000/alerts' `
  -Method POST `
  -ContentType 'application/json' `
  -Headers @{'Authorization'="Bearer $token"} `
  -Body $body `
  -UseBasicParsing

$response.Content | ConvertFrom-Json | ConvertTo-Json
```

---

## 🔑 Quick Reference: Common Headers

**Without Authentication:**
```json
{
  "Content-Type": "application/json"
}
```

**With Authentication (JWT):**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_ACCESS_TOKEN_HERE"
}
```

---

## ✅ Status Codes Reference

| Code | Meaning |
|------|---------|
| 200  | Success (OK) |
| 201  | Created |
| 400  | Bad Request (validation error) |
| 401  | Unauthorized (invalid/missing token) |
| 403  | Forbidden (no permission) |
| 404  | Not Found |
| 409  | Conflict (already exists) |
| 500  | Server Error |

---

## 🆘 Common Error Scenarios

### **Invalid Token**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### **User Already Exists**
```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

### **Validation Failed**
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 8 characters"
  ],
  "error": "Bad Request"
}
```

### **Resource Not Found**
```json
{
  "statusCode": 404,
  "message": "Trip not found"
}
```

---

**Last Updated:** May 26, 2026  
**API Version:** 1.0  
**Status:** ✅ Production Ready
