# PowerShell script to start backend with error checking

Write-Host "🚀 Starting Backend Server..." -ForegroundColor Green
Write-Host ""

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    @"
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/admin_dashboard
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_12345678901234567890
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
"@ | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✅ .env file created. Please update MONGODB_URI!" -ForegroundColor Yellow
    Write-Host ""
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "❌ ERROR: node_modules not found!" -ForegroundColor Red
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Check MongoDB service (Windows)
$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
if ($mongoService) {
    if ($mongoService.Status -ne "Running") {
        Write-Host "⚠️  MongoDB service is not running!" -ForegroundColor Yellow
        Write-Host "💡 Starting MongoDB service..." -ForegroundColor Yellow
        Start-Service MongoDB
        Start-Sleep -Seconds 2
    } else {
        Write-Host "✅ MongoDB service is running" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  MongoDB service not found. Using MongoDB Atlas?" -ForegroundColor Yellow
    Write-Host "💡 Make sure MONGODB_URI in .env is correct!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "▶️  Starting server..." -ForegroundColor Green
Write-Host ""

# Start the server
npm run dev

