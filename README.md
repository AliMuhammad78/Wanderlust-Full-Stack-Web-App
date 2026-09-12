# 🏡 Wanderlust 
 
### Full-Stack Travel & Property Listing Platform 

Wanderlust is a full-stack web application inspired by the core experience of platforms like Airbnb, where users can explore property listings, create their own listings, upload images, write reviews, and manage their content through an authenticated account.

This project was built as a hands-on learning project while following the web development course tutorials by **Apna College**. The project gave me practical experience with backend development, databases, authentication, authorization, MVC architecture, server-side rendering, image handling, validation, middleware, and full-stack application structure. 

> **Learning Project:** This repository represents my implementation and practice while following the Apna College course. The project idea and overall development flow were based on the course material. 
 
---    
 
## 🌐 Project Overview

Wanderlust allows users to interact with a travel/property listing platform through a complete web application.

The application provides functionality for:
 
* 👤 User registration and login
* 🔐 Authentication and authorization
* 🏠 Creating property listings
* ✏️ Editing existing listings
* 🗑️ Deleting listings
* 📷 Uploading listing images
* ☁️ Cloud-based image storage using Cloudinary
* ⭐ Creating reviews
* 🗑️ Deleting reviews
* 👑 Listing ownership management
* ✅ Server-side validation
* ⚠️ Custom error handling
* 💬 Flash messages 
* 🔄 Session management
* 🗄️ MongoDB database integration
* 🧩 MVC-based backend architecture
* 🎨 Dynamic EJS views

---

# 🛠️ Technology Stack

## Backend

| Technology | Purpose                            |
| ---------- | ---------------------------------- |
| Node.js    | JavaScript runtime                 |
| Express.js | Web server and routing             |
| MongoDB    | Database                           |
| Mongoose   | MongoDB object modeling            |
| EJS        | Server-side rendering              |
| EJS-Mate   | EJS layouts and reusable templates |

## Authentication & Sessions

| Technology              | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| Passport.js             | Authentication framework                 |
| Passport Local          | Username/password authentication         |
| Passport Local Mongoose | Authentication integration with Mongoose |
| Express Session         | Session management                       |
| Cookie Parser           | Cookie handling                          |
| Connect Flash           | Success/error messages                   |

## Validation & Error Handling

| Technology   | Purpose                                      |
| ------------ | -------------------------------------------- |
| Joi          | Request/data validation                      |
| ExpressError | Custom application errors                    |
| wrapAsync    | Async error handling                         |
| Middleware   | Authentication, authorization and validation |

## Image Upload & Storage 

| Technology            | Purpose                              |
| --------------------- | ------------------------------------ |
| Multer                | Handling multipart/form-data uploads |
| Cloudinary            | Cloud-based image storage            |
| Multer Memory Storage | Processing uploaded files in memory  |

## Frontend

| Technology | Purpose                        |
| ---------- | ------------------------------ |
| EJS        | Dynamic HTML rendering         |
| EJS-Mate   | Layouts and reusable templates |
| HTML/CSS   | User interface                 |
| JavaScript | Client-side functionality      |

---

# ✨ Key Features

## 👤 Authentication

Users can create an account, log in, and log out.

Authentication is implemented using:

* Passport.js
* Passport Local Strategy
* Passport Local Mongoose
* Express Session
* Serialized and deserialized users

The application stores the authenticated user's identity in the session and makes the current user available throughout the application.

---

## 🔐 Authorization
 
Authentication and authorization are handled separately.

The application verifies that:

* A user is logged in before performing protected actions.
* Only the owner of a listing can edit or delete it.
* Only the author of a review can delete it.

This introduced practical experience with **resource ownership and authorization middleware**.

---

## 🏠 Listing Management

Users can perform complete CRUD operations on listings.

### Create

Authenticated users can create a new listing containing information such as:

* Title
* Description
* Price
* Location
* Country
* Image

### Read

Users can:

* View all listings
* Open an individual listing
* View associated reviews
* View listing ownership information

### Update

Listing owners can edit their listings.

### Delete

Listing owners can delete their listings.

---

# ⭐ Review System

Listings can contain multiple reviews.

A review is associated with:

* A listing
* An author
* Review information

The relationship is represented using MongoDB ObjectId references.

When a listing is displayed, its reviews and review authors are populated using Mongoose.

This provided practical experience with:

* One-to-many relationships
* MongoDB references
* Mongoose `populate()`
* `$pull`
* Related document management

---

# 📷 Image Upload Pipeline

One of the important parts of this project was implementing image uploading.

The application uses **Multer** to receive uploaded files and **Cloudinary** for cloud-based image storage.

The general flow is:

```text
User selects image
       ↓
Multipart form submission
       ↓
Multer
       ↓
Memory Storage
       ↓
Image Buffer
       ↓
Cloudinary Upload Stream
       ↓
Cloudinary URL + Public ID
       ↓
MongoDB Listing Document
```

The listing stores the Cloudinary information as:

```text
image
├── url
└── filename
```

This helped me understand how file uploads can be separated from the application's main database storage.

---

# 🗄️ Database Design

The application uses **MongoDB** with **Mongoose**.

The main models are:

```text
User
  │
  └── owns ───────────► Listings
                           │
                           └── contains ─────► Reviews
                                                   │
                                                   └── written by User
```

### Main Models

#### User

Handles application users and authentication information.

#### Listing

Stores property/travel listing information.

A listing contains references to:

* Its owner
* Its reviews

#### Review

Stores review information and references the user who created it.

---

# 🔗 Mongoose Relationships

The project uses MongoDB references through `ObjectId`.

For example, a listing contains:

```javascript
owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
}
```

and reviews are represented through:

```javascript
reviews: [
    {
        type: Schema.Types.ObjectId,
        ref: "Review"
    }
]
```

The application then uses Mongoose population to retrieve related documents.

For example:

```javascript
.populate({
    path: "reviews",
    populate: {
        path: "author"
    }
})
.populate("owner")
```

This allowed me to work with relationships between MongoDB collections rather than keeping all information inside a single document.

---

# 🧹 Related Document Cleanup

The project also handles dependent data.

When a listing is deleted, its associated reviews are removed through a Mongoose post middleware:

```javascript
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({
            _id: {
                $in: listing.reviews
            }
        });
    }
});
```

This introduced the concept of maintaining **referential consistency** when working with related MongoDB documents.

---

# 🧩 MVC Architecture

The backend follows an MVC-inspired structure.

```text
Request
   │
   ▼
Routes
   │
   ▼
Middleware
   │
   ▼
Controller
   │
   ▼
Model
   │
   ▼
MongoDB
   │
   ▼
Controller
   │
   ▼
EJS View
   │
   ▼
Response
```

The application separates responsibilities into:

```text
models/
controllers/
routes/
views/
utils/
middleware.js
```

This made the application easier to organize compared with putting all application logic inside a single server file.

---

# 🛡️ Middleware Architecture

Middleware is used extensively throughout the application.

Some of the important middleware responsibilities include:

### Authentication

```text
isloggedIn
```

Checks whether a user is authenticated before accessing protected resources.

### Authorization

```text
isOwner
```

Checks whether the currently authenticated user owns a listing.

### Review Authorization

```text
isReviewAuthor
```

Ensures that only the review author can delete their review.

### Validation

```text
validateListing
validateReview
```

Validates incoming request data using Joi.

### Redirect Handling

```text
saveRedirectUrl
```

Stores the original URL when an unauthenticated user tries to access a protected route, allowing the application to redirect them back after authentication.

---

# ✅ Data Validation

The application uses **Joi** for server-side validation.

Validation is performed before data reaches the controller.

```text
Request
   ↓
Joi Validation
   ↓
Valid ───────► Controller
   │
   └── Invalid ───► ExpressError
```

This helped me understand why validation should not depend only on frontend forms.

Server-side validation provides an additional layer of protection for incoming data.

---

# ⚠️ Error Handling

The project includes custom error handling using:

```text
ExpressError
wrapAsync
Centralized Error Middleware
```

The `wrapAsync` utility helps handle errors from asynchronous controller functions without repeatedly writing the same `try/catch` structure.

A custom `ExpressError` class is used to provide:

* HTTP status codes
* Meaningful error messages

The application also contains a centralized Express error-handling middleware.

---

# 💬 Flash Messages

The project uses `connect-flash` to provide user feedback after operations.

Examples include:

```text
Successfully created a new listing!
Successfully updated the listing!
Successfully deleted the listing!
Created new review!
Successfully deleted review!
You must be signed in first!
```

These messages are passed to EJS through `res.locals`.

---

# 🖥️ Server-Side Rendering with EJS

Instead of using React for the frontend, this project uses **EJS (Embedded JavaScript Templates)** for server-side rendering.

The views are organized into:

```text
views/
├── layouts/
│   └── boilerplate.ejs
│
├── includes/
│   ├── flash.ejs
│   ├── footer.ejs
│   └── navbar.ejs
│
├── listings/
│   ├── index.ejs
│   ├── show.ejs
│   ├── new.ejs
│   └── edit.ejs
│
├── users/
│   ├── login.ejs
│   └── signup.ejs
│
└── error.ejs
```

Using EJS helped me understand how dynamic server-rendered applications work and how backend data can be passed directly into templates.

---

# 🧱 Project Structure

```text
Wanderlust/
│
├── controllers/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── init/
│   ├── data.js
│   └── index.js
│
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── public/
│   ├── css/
│   │   ├── rating.css
│   │   └── styles.css
│   │
│   └── js/
│       └── script.js
│
├── routes/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── uploads/
│
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
│
├── views/
│   ├── includes/
│   │   ├── flash.ejs
│   │   ├── footer.ejs
│   │   └── navbar.ejs
│   │
│   ├── layouts/
│   │   └── boilerplate.ejs
│   │
│   ├── listings/
│   │   ├── edit.ejs
│   │   ├── index.ejs
│   │   ├── new.ejs
│   │   └── show.ejs
│   │
│   ├── users/
│   │   ├── login.ejs
│   │   └── signup.ejs
│   │
│   └── error.ejs
│
├── .env
├── app.js
├── cloudConfig.js
├── middleware.js
├── package.json
├── package-lock.json
└── schema.js
```

---

# 🔄 Application Flow

A typical listing creation request follows this architecture:

```text
Browser
   │
   ▼
POST /listings
   │
   ▼
Authentication Middleware
   │
   ▼
Joi Validation
   │
   ▼
Multer
   │
   ▼
Cloudinary
   │
   ▼
Listing Controller
   │
   ▼
Mongoose
   │
   ▼
MongoDB
   │
   ▼
Flash Message
   │
   ▼
Redirect
   │
   ▼
Listings Page
```

This project therefore gave me practical exposure to how different layers of a web application communicate with one another.

---

# 📚 Concepts Practiced

Building this project allowed me to practice a broad range of web development concepts.

### JavaScript & Node.js

* Node.js fundamentals
* Modules
* Async/await
* Promises
* Error handling
* Environment variables

### Express.js

* Express application setup
* Routing
* Route parameters
* Middleware
* Request/response handling
* Static files
* HTTP methods
* Method override
* Error-handling middleware

### REST & CRUD

* GET
* POST
* PUT
* DELETE
* CRUD operations
* REST-style resource routes

### MongoDB & Mongoose

* MongoDB databases
* Collections
* Documents
* Mongoose schemas
* Mongoose models
* ObjectId references
* Relationships
* Population
* Querying
* Updating documents
* Deleting documents
* `$pull`
* Middleware/hooks

### Authentication

* Passport.js
* Local Strategy
* Passport Local Mongoose
* Sessions
* Serialization
* Deserialization
* Login/logout
* Protected routes

### Authorization

* Ownership verification
* Resource-level authorization
* Review author verification
* Authentication vs authorization

### Frontend

* HTML
* CSS
* JavaScript
* EJS
* EJS layouts
* EJS partials
* Dynamic rendering
* Forms 

### File Handling

* Multipart forms
* Multer
* Memory storage
* Buffers
* Cloudinary
* Upload streams
* Cloud-based image storage

### Validation & Reliability

* Joi validation
* Custom errors
* Async error handling
* Express error middleware
* Flash messages

---

# 🧠 What I Learned From Building It

The biggest value of this project was not simply getting a website to work.

It helped me understand how the individual parts of a full-stack application fit together.

I practiced moving from:

```text
User Interface
      ↓
HTTP Request
      ↓
Route
      ↓
Middleware
      ↓
Controller
      ↓
Model
      ↓
Database
      ↓
Response
      ↓
Rendered View
```

I also gained a better understanding of why applications are separated into different layers and how authentication, authorization, validation, database relationships, file uploads, and error handling work together in a real application.

---

# 🔐 Environment Variables

Sensitive configuration should not be committed to GitHub.

The project uses environment variables through `dotenv` and Cloudinary configuration.

Create a `.env` file locally with the required configuration.

Example:

```env
CLOUDINARY_URL=your_cloudinary_configuration
```

> Never commit your actual credentials, API keys, passwords, or secrets to the repository.

For a public repository, a `.env.example` file can be added containing only placeholder values.

---

# 🚀 Installation & Setup

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Wanderlust
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env` file and add your required Cloudinary configuration.

## 4. Start MongoDB

Make sure MongoDB is running locally.

The development database used by the application is:

```text
mongodb://127.0.0.1:27017/wanderlust
```

## 5. Start the Application

```bash
node app.js
```

The application runs on:

```text
http://localhost:8080
```

---

# 📦 Main Dependencies

Some of the major packages used in this project include:

```text
express
mongoose
ejs
ejs-mate
passport
passport-local
passport-local-mongoose
express-session
connect-flash
multer
cloudinary
joi
method-override
dotenv
cookie-parser
```

---

# 🔮 Possible Future Improvements

Although the application already covers a wide range of full-stack concepts, several improvements could be added in the future:

* 🔎 Search and filtering
* 🗺️ Interactive maps
* 📍 Location-based search
* ⭐ Improved rating system
* 📱 More responsive UI
* ⚡ Better frontend interactions
* 🖼️ Multiple-image galleries
* 🔔 More advanced notifications
* 🧪 Automated testing
* 🚀 Production deployment
* 🔒 Additional security hardening
* 📄 Pagination
* 🧑‍💼 Improved user profile management
* 💳 Booking/payment functionality

---

# 🎓 Learning Context

This project was developed during my learning journey through the **Apna College web development course**.

The project was built by following the course's video-based development process and implementing the concepts hands-on.

Rather than treating the project as only a final application, I used it as an opportunity to understand and practice the technologies and concepts involved in building a complete web application.

### Concepts explored through this project include:

```text
Node.js
Express.js
MongoDB
Mongoose
EJS
MVC Architecture
REST APIs / RESTful Routing
CRUD
Authentication
Authorization
Sessions
Passport.js
Middleware
Joi Validation
Error Handling
Multer
Cloudinary
Server-Side Rendering
Database Relationships
```

**Credit:** Apna College — Web Development Course

---

# 📌 Important Note

This repository is **not a MERN application** because React is not used in this project.

The frontend of Wanderlust is implemented using **EJS server-side rendering**, while the backend is built with **Node.js + Express.js** and the database uses **MongoDB/Mongoose**.

I have separately studied React as part of my broader web development learning journey, but React is not part of this particular project.

---

# 👨‍💻 Author

## Muhammad Ali Saagar

Computer Science Student | Data Science & AI Enthusiast | Full-Stack Development Learner

### Connect With Me

* 💻 GitHub: [AliMuhammad78](https://github.com/AliMuhammad78)
* 💼 LinkedIn: [Muhammad Ali](https://www.linkedin.com/in/muhammad-ali-91294a290/)
* 📊 Kaggle: [ali98muhammad45](https://www.kaggle.com/ali98muhammad45)

---

# ⭐ Final Thoughts

Wanderlust represents one of my major hands-on full-stack learning projects.

Through this project, I moved beyond individual tutorials and practiced connecting multiple technologies into one working application — from authentication and routing to database relationships, validation, image uploads, cloud storage, error handling, and server-side rendering.

It provided practical experience with the architecture and development workflow involved in building a real-world web application from the ground up.

If you find the project useful or interesting, consider ⭐ starring the repository.
