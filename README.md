# Surprise Tokri - Mystery Box E-commerce Platform

A comprehensive e-commerce platform for mystery boxes with admin management, user authentication, and payment integration.

## 🚀 Features

### Admin Features
- **Dashboard Analytics** - Real-time sales, revenue, and customer statistics
- **Box Management** - CRUD operations for mystery boxes with Cloudinary image upload
- **Order Management** - Order tracking, status updates, and payment verification
- **Customer Management** - User profiles, tier management, and analytics
- **Support System** - Ticket management and customer support

### User Features
- **Authentication** - Secure login/register with JWT tokens
- **Shopping Cart** - Add/remove items with quantity management
- **Checkout** - Address management and payment proof upload
- **Order Tracking** - Real-time order status and delivery tracking
- **Profile Management** - Personal information and address management
- **Support Center** - Ticket creation and messaging system

### Payment System
- **Manual Payment Verification** - Screenshot upload with transaction ID
- **UPI Integration Ready** - Prepared for future UPI payment gateway
- **Payment Proof Management** - Admin verification of payment screenshots

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Image Storage**: Cloudinary
- **Database**: MongoDB
- **Payment**: Manual screenshot verification (UPI ready)

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or cloud)
- Cloudinary account
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd surprise-tokri
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and configure your variables:

```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/surprise-tokri

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Surprise Tokri

# Payment Configuration
PAYMENT_METHOD=manual_screenshot
PAYMENT_UPI_ID=your-upi-id@bank
PAYMENT_PHONE=+91-9876543210
```

### 4. Database Setup
Ensure MongoDB is running and accessible. The application will automatically create collections and indexes.

### 5. Cloudinary Setup
1. Create a Cloudinary account at https://cloudinary.com
2. Get your cloud name, API key, and API secret
3. Add them to your `.env.local` file

### 6. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
surprise-tokri/
├── src/
│   ├── app/
│   │   ├── admin/           # Admin pages
│   │   ├── api/             # Backend API routes
│   │   ├── auth/            # Authentication pages
│   │   ├── boxes/           # Product pages
│   │   ├── cart/            # Shopping cart
│   │   ├── checkout/        # Checkout process
│   │   ├── dashboard/       # User dashboard
│   │   ├── orders/          # Order management
│   │   └── account/         # User account pages
│   ├── lib/
│   │   ├── api.js           # API utility functions
│   │   ├── auth.js          # Authentication helpers
│   │   ├── cloudinary.js    # Image upload utilities
│   │   └── db.js            # Database connection
│   └── models/
│       ├── User.js          # User model
│       ├── Box.js           # Product model
│       ├── Order.js         # Order model
│       ├── Address.js       # Address model
│       └── SupportTicket.js # Support ticket model
├── env.example              # Environment variables template
└── README.md               # This file
```

## 🔐 Authentication

The application uses JWT-based authentication with the following features:

- **User Registration** - Email/password with validation
- **User Login** - Email or phone number login
- **Admin Access** - Role-based admin authorization
- **Password Security** - bcrypt hashing with salt
- **Token Management** - Automatic token storage and cleanup

## 💳 Payment System

### Current Implementation (Manual Verification)
1. User selects payment method (UPI/COD)
2. User uploads payment screenshot with transaction ID
3. Admin verifies payment proof
4. Order status updated accordingly

### Future UPI Integration
The system is prepared for direct UPI integration with:
- Payment gateway hooks
- Transaction verification
- Automatic status updates

## 🖼️ Image Management

Images are stored using Cloudinary with:
- Automatic optimization
- Responsive image delivery
- Secure upload endpoints
- Folder organization

## 📊 Admin Features

### Dashboard
- Real-time analytics
- Revenue tracking
- Order statistics
- Customer insights

### Box Management
- Create/edit/delete mystery boxes
- Image upload and management
- Stock tracking
- Category organization

### Order Management
- Order status updates
- Payment verification
- Tracking information
- Customer communication

### Customer Management
- User profiles
- Order history
- Tier management
- Support tickets

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Admin APIs
- `GET /api/admin/dashboard` - Dashboard analytics
- `GET /api/admin/boxes` - Box management
- `GET /api/admin/orders` - Order management
- `GET /api/admin/customers` - Customer management
- `GET /api/admin/support` - Support tickets

### User APIs
- `GET /api/user/profile` - User profile
- `GET /api/user/orders` - Order history
- `GET /api/user/addresses` - Address management

### Public APIs
- `GET /api/boxes` - Product listing
- `POST /api/contact` - Contact form
- `POST /api/influencers` - Influencer requests

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- [ ] Direct UPI payment integration
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Advanced inventory management
- [ ] Automated shipping integration

---

**Built with ❤️ for Surprise Tokri**
