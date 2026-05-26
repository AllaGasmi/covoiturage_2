# ============================================================================
# COVOITURAGE API - QUICK TEST SCRIPTS
# ============================================================================
# Copy & paste commands into PowerShell to test endpoints
# ============================================================================

# ============================================================================
# 1️⃣ AUTHENTICATION TESTS
# ============================================================================

# TEST 1.1: Register User
Write-Host "1️⃣ REGISTERING USER..." -ForegroundColor Cyan
$body = @{
  name='Test Driver'
  email='driver@example.com'
  password='Driver123!'
  phone='+33612345678'
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://localhost:3000/auth/register' `
  -Method POST `
  -ContentType 'application/json' `
  -Body $body `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
$DRIVER_TOKEN = $result.accessToken
$DRIVER_ID = $result.user.id
Write-Host "✅ Driver registered! ID: $DRIVER_ID"
Write-Host "Token: $($DRIVER_TOKEN.Substring(0, 50))..."

# TEST 1.2: Register Passenger
Write-Host "`n1️⃣ REGISTERING PASSENGER..." -ForegroundColor Cyan
$body = @{
  name='Test Passenger'
  email='passenger@example.com'
  password='Passenger123!'
  phone='+33698765432'
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://localhost:3000/auth/register' `
  -Method POST `
  -ContentType 'application/json' `
  -Body $body `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
$PASSENGER_TOKEN = $result.accessToken
$PASSENGER_ID = $result.user.id
Write-Host "✅ Passenger registered! ID: $PASSENGER_ID"
Write-Host "Token: $($PASSENGER_TOKEN.Substring(0, 50))..."

# TEST 1.3: Login
Write-Host "`n1️⃣ LOGGING IN..." -ForegroundColor Cyan
$body = @{
  email='driver@example.com'
  password='Driver123!'
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://localhost:3000/auth/login' `
  -Method POST `
  -ContentType 'application/json' `
  -Body $body `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
Write-Host "✅ Login successful!"
$result | ConvertTo-Json | Write-Host

# ============================================================================
# 2️⃣ TRIPS TESTS (as Driver)
# ============================================================================

# TEST 2.1: Create Trip
Write-Host "`n🛣️ CREATING TRIP..." -ForegroundColor Cyan
$body = @{
  departure='Tunis'
  destination='Nabeul'
  date='2026-06-15'
  seats=3
  price=45.50
  description='Comfortable ride with AC'
  carModel='Toyota Corolla 2020'
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://localhost:3000/trips' `
  -Method POST `
  -ContentType 'application/json' `
  -Headers @{'Authorization'="Bearer $DRIVER_TOKEN"} `
  -Body $body `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
$TRIP_ID = $result.id
Write-Host "✅ Trip created! ID: $TRIP_ID"
$result | ConvertTo-Json | Write-Host

# TEST 2.2: Get My Trips
Write-Host "`n🛣️ GETTING MY TRIPS..." -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri 'http://localhost:3000/trips/mine' `
  -Method GET `
  -Headers @{'Authorization'="Bearer $DRIVER_TOKEN"} `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
Write-Host "✅ Found $(($result | Measure-Object).Count) trips"
$result | ConvertTo-Json | Write-Host

# TEST 2.3: Update Trip
Write-Host "`n🛣️ UPDATING TRIP..." -ForegroundColor Cyan
$body = @{
  seats=2
  price=55.00
  description='Updated: Direct route, no stops'
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:3000/trips/$TRIP_ID" `
  -Method PUT `
  -ContentType 'application/json' `
  -Headers @{'Authorization'="Bearer $DRIVER_TOKEN"} `
  -Body $body `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
Write-Host "✅ Trip updated!"
$result | ConvertTo-Json | Write-Host

# ============================================================================
# 3️⃣ BOOKINGS TESTS (as Passenger)
# ============================================================================

# TEST 3.1: Create Booking
Write-Host "`n📦 CREATING BOOKING..." -ForegroundColor Cyan
$body = @{
  tripId=$TRIP_ID
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://localhost:3000/bookings' `
  -Method POST `
  -ContentType 'application/json' `
  -Headers @{'Authorization'="Bearer $PASSENGER_TOKEN"} `
  -Body $body `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
$BOOKING_ID = $result.id
Write-Host "✅ Booking created! ID: $BOOKING_ID"
$result | ConvertTo-Json | Write-Host

# TEST 3.2: Get Pending Bookings (as Driver)
Write-Host "`n📦 GETTING PENDING BOOKINGS (as Driver)..." -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri "http://localhost:3000/bookings/trip/$TRIP_ID/pending" `
  -Method GET `
  -Headers @{'Authorization'="Bearer $DRIVER_TOKEN"} `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
Write-Host "✅ Found $(($result | Measure-Object).Count) pending bookings"
$result | ConvertTo-Json | Write-Host

# TEST 3.3: Confirm Booking (as Driver)
Write-Host "`n📦 CONFIRMING BOOKING..." -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri "http://localhost:3000/bookings/$BOOKING_ID/confirm" `
  -Method PATCH `
  -Headers @{'Authorization'="Bearer $DRIVER_TOKEN"} `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
Write-Host "✅ Booking confirmed!"
$result | ConvertTo-Json | Write-Host

# TEST 3.4: Create Second Booking to Test Rejection
Write-Host "`n📦 CREATING SECOND BOOKING FOR REJECTION TEST..." -ForegroundColor Cyan
# Register another passenger
$body = @{
  name='Test Passenger 2'
  email='passenger2@example.com'
  password='Passenger123!'
  phone='+33712345678'
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://localhost:3000/auth/register' `
  -Method POST `
  -ContentType 'application/json' `
  -Body $body `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
$PASSENGER2_TOKEN = $result.accessToken

# Create booking
$body = @{
  tripId=$TRIP_ID
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://localhost:3000/bookings' `
  -Method POST `
  -ContentType 'application/json' `
  -Headers @{'Authorization'="Bearer $PASSENGER2_TOKEN"} `
  -Body $body `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
$BOOKING_ID_2 = $result.id
Write-Host "✅ Second booking created! ID: $BOOKING_ID_2"

# TEST 3.5: Reject Booking
Write-Host "`n📦 REJECTING BOOKING..." -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri "http://localhost:3000/bookings/$BOOKING_ID_2/reject" `
  -Method PATCH `
  -Headers @{'Authorization'="Bearer $DRIVER_TOKEN"} `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
Write-Host "✅ Booking rejected!"
$result | ConvertTo-Json | Write-Host

# ============================================================================
# 4️⃣ ALERTS TESTS (as Passenger)
# ============================================================================

# TEST 4.1: Create Alert
Write-Host "`n🔔 CREATING ALERT..." -ForegroundColor Cyan
$body = @{
  departure='Tunis'
  destination='Sousse'
  date='2026-06-20'
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://localhost:3000/alerts' `
  -Method POST `
  -ContentType 'application/json' `
  -Headers @{'Authorization'="Bearer $PASSENGER_TOKEN"} `
  -Body $body `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
$ALERT_ID = $result.id
Write-Host "✅ Alert created! ID: $ALERT_ID"
$result | ConvertTo-Json | Write-Host

# TEST 4.2: Get My Alerts
Write-Host "`n🔔 GETTING MY ALERTS..." -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri 'http://localhost:3000/alerts' `
  -Method GET `
  -Headers @{'Authorization'="Bearer $PASSENGER_TOKEN"} `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
Write-Host "✅ Found $(($result | Measure-Object).Count) alerts"
$result | ConvertTo-Json | Write-Host

# TEST 4.3: Delete Alert
Write-Host "`n🔔 DELETING ALERT..." -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri "http://localhost:3000/alerts/$ALERT_ID" `
  -Method DELETE `
  -Headers @{'Authorization'="Bearer $PASSENGER_TOKEN"} `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
Write-Host "✅ Alert deleted!"
$result | ConvertTo-Json | Write-Host

# ============================================================================
# 5️⃣ CLEANUP TESTS
# ============================================================================

# TEST 5.1: Cancel Booking
Write-Host "`n📦 CANCELLING BOOKING..." -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri "http://localhost:3000/bookings/$BOOKING_ID" `
  -Method DELETE `
  -Headers @{'Authorization'="Bearer $PASSENGER_TOKEN"} `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
Write-Host "✅ Booking cancelled!"
$result | ConvertTo-Json | Write-Host

# TEST 5.2: Cancel Trip
Write-Host "`n🛣️ CANCELLING TRIP..." -ForegroundColor Cyan
$response = Invoke-WebRequest -Uri "http://localhost:3000/trips/$TRIP_ID" `
  -Method DELETE `
  -Headers @{'Authorization'="Bearer $DRIVER_TOKEN"} `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
Write-Host "✅ Trip cancelled!"
$result | ConvertTo-Json | Write-Host

# TEST 5.3: Logout
Write-Host "`n🔐 LOGGING OUT..." -ForegroundColor Cyan
$body = @{
  refreshToken=$DRIVER_TOKEN
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://localhost:3000/auth/logout' `
  -Method POST `
  -ContentType 'application/json' `
  -Headers @{'Authorization'="Bearer $DRIVER_TOKEN"} `
  -Body $body `
  -UseBasicParsing

$result = $response.Content | ConvertFrom-Json
Write-Host "✅ Logout successful!"
$result | ConvertTo-Json | Write-Host

# ============================================================================
# ✅ ALL TESTS COMPLETED
# ============================================================================
Write-Host "`n" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ ALL TESTS COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
