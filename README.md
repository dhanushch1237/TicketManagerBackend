# TicketHub Backend API

A comprehensive REST API for the TicketHub ticket marketplace application.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Ticket Management**: CRUD operations for tickets with filtering and search
- **Purchase System**: Complete purchase flow with inventory management
- **User Profiles**: User management and statistics
- **Sample Data**: Pre-populated with realistic users, tickets, and purchases

## Quick Start

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

4. **API Health Check**
   ```
   GET http://localhost:3001/api/health
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Tickets
- `GET /api/tickets` - Get all tickets (with filtering)
- `GET /api/tickets/:id` - Get single ticket
- `POST /api/tickets` - Create new ticket (auth required)
- `PUT /api/tickets/:id` - Update ticket (auth required, owner only)
- `DELETE /api/tickets/:id` - Delete ticket (auth required, owner only)
- `GET /api/tickets/user/my-tickets` - Get user's tickets (auth required)

### Purchases
- `GET /api/purchases/my-purchases` - Get user's purchases (auth required)
- `POST /api/purchases` - Create new purchase (auth required)
- `GET /api/purchases/:id` - Get purchase details (auth required)
- `PUT /api/purchases/:id/cancel` - Cancel purchase (auth required)
- `GET /api/purchases/sales/my-sales` - Get user's sales (auth required)

### Users
- `GET /api/users/stats` - Get user statistics (auth required)
- `GET /api/users/:id` - Get user public profile
- `GET /api/users` - Search users

## Sample Data

The API comes pre-populated with:

### Users (5 sample users)
- **Email**: john.doe@example.com, jane.smith@example.com, etc.
- **Password**: password123 (for all sample users)

### Tickets (8 sample tickets)
- World Cup Cricket Final
- Taylor Swift Eras Tour
- Broadway Musical - Hamilton
- NBA Finals Game 7
- Comedy Night with Dave Chappelle
- Coachella Music Festival
- Super Bowl LVIII
- Shakespeare in the Park

### Purchases (5 sample purchases)
- Various confirmed and pending purchases between users

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Filtering & Search

### Tickets Filtering
```
GET /api/tickets?category=concert&type=vip&minPrice=100&maxPrice=500&search=taylor
```

Parameters:
- `category`: cricket, entertainment, concert, sports, theater, comedy
- `type`: general, vip, premium, standard
- `minPrice`, `maxPrice`: Price range
- `location`: Location search
- `search`: Text search in title, description, location
- `status`: active, sold_out, paused
- `page`, `limit`: Pagination
- `sortBy`: created_at, price, title
- `sortOrder`: asc, desc

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

## Development

### Project Structure
```
server/
├── data/
│   └── sampleData.js      # Sample data
├── middleware/
│   └── auth.js            # Authentication middleware
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── tickets.js         # Ticket routes
│   ├── purchases.js       # Purchase routes
│   └── users.js           # User routes
├── .env                   # Environment variables
├── server.js              # Main server file
└── package.json
```

### Adding New Features

1. **New Route**: Add to appropriate route file
2. **Authentication**: Use `authenticateToken` middleware
3. **Validation**: Add input validation
4. **Error Handling**: Use try-catch blocks
5. **Sample Data**: Update `sampleData.js` if needed

## Production Deployment

1. **Environment Variables**
   - Set `NODE_ENV=production`
   - Use strong `JWT_SECRET`
   - Configure proper `PORT`

2. **Database Integration**
   - Replace in-memory arrays with database
   - Add connection pooling
   - Implement proper migrations

3. **Security Enhancements**
   - Add rate limiting
   - Implement CORS properly
   - Add request validation
   - Use HTTPS

4. **Monitoring**
   - Add logging
   - Implement health checks
   - Add performance monitoring

## Testing

You can test the API using tools like:
- **Postman**: Import the collection
- **curl**: Command line testing
- **Frontend**: Connect your React app

### Sample Login Request
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john.doe@example.com", "password": "password123"}'
```

## Support

For issues and questions:
1. Check the error logs
2. Verify environment variables
3. Ensure all dependencies are installed
4. Check API endpoint documentation