# MalikShop - WNBA Jersey Store

A full-stack e-commerce platform specializing in WNBA team jerseys and player merchandise. Built with React frontend and Node.js backend.

## 🏀 Features

### Frontend (React)

- **Modern UI/UX**: Clean, responsive design with Bootstrap styling
- **Product Catalog**: Browse WNBA team jerseys and player merchandise
- **Team Pages**: Dedicated pages for each WNBA team with player rosters
- **Player Cards**: Individual player pages with headshots and jersey options
- **Shopping Cart**: Add/remove items, quantity management
- **Favorites System**: Save favorite products for later
- **User Authentication**: Login/register with JWT tokens
- **Admin Panel**: Product management, user management, order tracking
- **Search & Filter**: Find products by team, player, or keyword
- **Responsive Design**: Works on desktop, tablet, and mobile

### Backend (Node.js/Express)

- **RESTful API**: Complete CRUD operations for products, users, orders
- **Authentication**: JWT-based user authentication and authorization
- **File Upload**: Image upload system for product photos
- **Database Integration**: MongoDB with Mongoose ODM
- **Payment Integration**: PayPal payment processing
- **WNBA API Integration**: Real-time player and team data
- **Error Handling**: Comprehensive error middleware
- **Data Seeding**: Automated product and user data population

## 🛠 Tech Stack

### Frontend

- **React 18** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Bootstrap 5** - CSS framework
- **Axios** - HTTP client
- **React Helmet Async** - Document head management

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **PayPal SDK** - Payment processing
- **Bcrypt** - Password hashing

## 📁 Project Structure

```
malikshop/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   │   ├── images/          # Product images, team logos, player headshots
│   │   └── index.html       # Main HTML file
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── screens/         # Page components
│   │   ├── slices/          # Redux Toolkit slices
│   │   ├── utils/           # Utility functions
│   │   └── assets/          # CSS and other assets
│   └── package.json
├── backend/                  # Node.js backend application
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── data/                # Seed data and caching
│   └── server.js            # Main server file
├── uploads/                 # File upload directory
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- PayPal Developer Account (for payments)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd malikshop
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   ```

4. **Database Setup**

   ```bash
   cd backend
   npm run data:import    # Import seed data
   ```

5. **Start the application**

   ```bash
   # Start backend (from backend directory)
   npm run dev

   # Start frontend (from frontend directory)
   npm start
   ```

## 🎯 Key Features Implemented

### 1. Product Management

- **WNBA Team Jerseys**: All 12 WNBA teams with authentic jerseys
- **Player Headshots**: High-quality player photos for each team
- **Dynamic Pricing**: Real-time price calculations
- **Inventory Management**: Stock tracking and availability

### 2. User Experience

- **Modern Card Design**: Sleek product cards with hover effects
- **Responsive Grid**: Uniform product grid layout
- **Team Filtering**: Browse by team or view all products
- **Search Functionality**: Find products by name or player
- **Favorites System**: Save and manage favorite items

### 3. Shopping Features

- **Shopping Cart**: Persistent cart with quantity controls
- **Checkout Process**: Multi-step checkout with shipping and payment
- **Order Management**: Track order status and history
- **Payment Integration**: Secure PayPal payment processing

### 4. Admin Features

- **Product CRUD**: Create, read, update, delete products
- **User Management**: View and manage user accounts
- **Order Tracking**: Monitor and update order status
- **Image Upload**: Upload product images via admin panel

### 5. Data Integration

- **WNBA API**: Real-time player and team data
- **Caching System**: Efficient API call caching
- **Data Seeding**: Automated product and user data
- **Image Management**: Organized player headshots and team logos

## 🎨 UI/UX Highlights

### Product Cards

- **Modern Design**: Soft shadows, rounded corners, clean typography
- **Image Layout**: Full-bleed top images with team overlay
- **Interactive Elements**: Hover effects, always-visible action buttons
- **Badge System**: "Top Seller" badges for featured products

### Team Pages

- **Team Branding**: Team-specific colors and logos
- **Player Grid**: Organized player cards with headshots
- **Navigation**: Easy team-to-team navigation

### Responsive Design

- **Mobile-First**: Optimized for all screen sizes
- **Grid System**: Bootstrap-based responsive layouts
- **Touch-Friendly**: Optimized for mobile interactions

## 🔧 Development Notes

### File Structure Decisions

- **Separate Frontend/Backend**: Clear separation of concerns
- **Component Organization**: Logical grouping of React components
- **API Structure**: RESTful endpoints with clear naming conventions

### Data Management

- **Redux Toolkit**: Modern state management with RTK Query
- **Caching Strategy**: Efficient API response caching
- **Error Handling**: Comprehensive error boundaries and fallbacks

### Performance Optimizations

- **Image Optimization**: Proper image sizing and formats
- **Lazy Loading**: Components and images loaded on demand
- **Code Splitting**: Efficient bundle splitting

## 🐛 Common Issues & Solutions

### Image Not Found Errors

- **Issue**: `/uploads/image-xxxxx.jpg` returns 404
- **Solution**: Ensure uploads directory exists and is properly served by Express

### Player Image Issues

- **Issue**: Player headshots not displaying
- **Solution**: Verify image paths match player data structure

### Database Connection

- **Issue**: MongoDB connection failures
- **Solution**: Check MONGO_URI in .env file and ensure MongoDB is running

## 📝 API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Users

- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Orders

- `POST /api/orders` - Create order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get order details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- **Developer**:Malik Warren
- **Project**: WNBA Jersey E-commerce Platform
- **Version**: 1.0.0

---

**Note**: This is a demonstration project showcasing full-stack development with React and Node.js. The WNBA team and player data is used for educational purposes.
