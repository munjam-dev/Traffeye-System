# 🗄️ TraffEye MongoDB Connection

A complete MongoDB connection setup using Mongoose and dotenv for the TraffEye traffic violation detection system.

## 📋 Features

- ✅ **Mongoose ODM** - Modern MongoDB object modeling
- ✅ **dotenv Configuration** - Environment variable management
- ✅ **Connection Management** - Automatic reconnection and health checks
- ✅ **Data Models** - User, Violation, and Camera schemas
- ✅ **REST API** - Complete CRUD operations
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Health Monitoring** - Connection status and database statistics

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd mongodb-connection
npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB_NAME=traffeye
PORT=3001
```

### 3. Start MongoDB (if not running)
```bash
# On Windows
mongod

# On Mac/Linux
sudo mongod
# or
brew services start mongodb-community
```

### 4. Test Connection
```bash
npm test
```

### 5. Start Server
```bash
npm start
# or for development
npm run dev
```

## 🌐 API Endpoints

### Base URL: `http://localhost:3001`

### Health & Status
- `GET /` - Server information
- `GET /health` - Database health check
- `GET /api/stats` - Database statistics

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `GET /api/users/:id` - Get user by ID

### Violations
- `GET /api/violations` - Get all violations (with filters)
- `POST /api/violations` - Create new violation
- `GET /api/violations/statistics` - Get violation statistics

### Cameras
- `GET /api/cameras` - Get all cameras
- `POST /api/cameras` - Add new camera
- `GET /api/cameras/offline` - Get offline cameras

## 📊 Data Models

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String,
  vehicles: [String], // Vehicle numbers
  role: String, // user, admin, traffic_police
  isActive: Boolean,
  createdAt: Date,
  lastLogin: Date
}
```

### Violation Schema
```javascript
{
  vehicleNumber: String (required),
  violationType: String (required), // no_helmet, triple_riding, signal_violation
  date: Date (required),
  time: String (required),
  location: String (required),
  latitude: Number (required),
  longitude: Number (required),
  imageUrl: String (required),
  fineAmount: Number (required),
  status: String, // unpaid, paid, disputed
  confidenceScore: Number (required),
  cameraId: String (required),
  evidence: {
    boundingBoxes: [Object],
    metadata: Object
  }
}
```

### Camera Schema
```javascript
{
  cameraId: String (required, unique),
  location: String (required),
  latitude: Number (required),
  longitude: Number (required),
  status: String, // active, inactive, maintenance
  cameraType: String, // traffic, speed, signal
  rtspUrl: String (required),
  detectionZones: [Object],
  aiConfig: {
    helmetDetection: Object,
    tripleRidingDetection: Object,
    signalViolationDetection: Object
  }
}
```

## 🔧 Configuration

### Environment Variables
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB_NAME=traffeye

# Server Configuration
PORT=3001
NODE_ENV=development

# Connection Options
MONGODB_OPTIONS=retryWrites=true&w=majority
```

### Database Connection Options
- **maxPoolSize**: 10 connections
- **serverSelectionTimeoutMS**: 5000ms
- **socketTimeoutMS**: 45000ms
- **retryWrites**: true
- **w**: majority

## 📝 Usage Examples

### Create a New User
```javascript
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "vehicles": ["MH12AB1234", "MH15CD5678"],
  "role": "user"
}
```

### Create a New Violation
```javascript
POST /api/violations
Content-Type: application/json

{
  "vehicleNumber": "MH12AB1234",
  "violationType": "no_helmet",
  "date": "2024-04-04",
  "time": "14:30:25",
  "location": "Main Street & 5th Avenue",
  "latitude": 19.0760,
  "longitude": 72.8777,
  "imageUrl": "/violations/image.jpg",
  "fineAmount": 500,
  "confidenceScore": 0.95,
  "cameraId": "CAM001"
}
```

### Get Violations with Filters
```javascript
GET /api/violations?status=unpaid&vehicleNumber=MH12AB1234&page=1&limit=20
```

### Get Violation Statistics
```javascript
GET /api/violations/statistics?startDate=2024-04-01&endDate=2024-04-30
```

## 🛠️ Development

### Project Structure
```
mongodb-connection/
├── config/
│   └── database.js      # Database connection class
├── models/
│   ├── User.js          # User model
│   ├── Violation.js     # Violation model
│   ├── Camera.js        # Camera model
│   └── index.js         # Export all models
├── server.js            # Express server
├── test-connection.js   # Connection test script
├── package.json         # Dependencies
├── .env                 # Environment variables
└── README.md           # This file
```

### Scripts
```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
npm test         # Test database connection
```

## 🔍 Testing

### Test Database Connection
```bash
npm test
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:3001/health

# Get users
curl http://localhost:3001/api/users

# Get statistics
curl http://localhost:3001/api/stats
```

## 📊 Monitoring

### Health Check Response
```json
{
  "status": "healthy",
  "timestamp": "2024-04-04T14:30:25.000Z",
  "database": {
    "status": "healthy",
    "message": "Database connection is working",
    "details": {
      "state": "connected",
      "host": "localhost",
      "port": 27017,
      "name": "traffeye"
    }
  },
  "connection": {
    "state": "connected",
    "host": "localhost",
    "port": 27017,
    "name": "traffeye"
  },
  "uptime": 3600.5
}
```

### Database Statistics Response
```json
{
  "database": {
    "collections": 3,
    "dataSize": 1048576,
    "indexes": 5,
    "objects": 150
  },
  "collections": {
    "users": 25,
    "violations": 100,
    "cameras": 25
  },
  "timestamp": "2024-04-04T14:30:25.000Z"
}
```

## 🚨 Error Handling

### Common Errors
1. **Connection Failed** - Check if MongoDB is running
2. **Authentication Error** - Verify MongoDB credentials
3. **Validation Error** - Check request body format
4. **Duplicate Key** - Handle unique constraint violations

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "message": "User-friendly description"
}
```

## 🔐 Security Features

- **Input Validation** - Mongoose schema validation
- **MongoDB Injection Protection** - Mongoose sanitization
- **Environment Variables** - Sensitive data in .env
- **CORS Configuration** - Cross-origin request handling
- **Error Sanitization** - Safe error messages in production

## 📈 Performance

### Database Indexes
- Users: email, vehicles, createdAt
- Violations: vehicleNumber, violationType, status, date
- Cameras: cameraId, location, status, coordinates

### Connection Pooling
- Max 10 connections
- Automatic reconnection
- Connection timeout handling

## 🚀 Production Deployment

### Environment Setup
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/traffeye
MONGODB_DB_NAME=traffeye_prod
PORT=3001
```

### PM2 Configuration
```javascript
module.exports = {
  apps: [{
    name: 'traffeye-api',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
```

## 📞 Support

For issues and questions:
1. Check MongoDB connection: `npm test`
2. Verify environment variables in `.env`
3. Ensure MongoDB is running on port 27017
4. Check logs for detailed error messages

---

**🚦 TraffEye MongoDB Connection - Ready for Production!**
