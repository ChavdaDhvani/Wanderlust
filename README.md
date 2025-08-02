# 🌍 Wanderlust - Travel Listings Website

Wanderlust is a full-stack travel listings web application where users can explore, create, and review travel destinations.  
It is built using **Node.js**, **Express**, **MongoDB**, and **EJS** for server-side rendering.  
The site is **fully deployed** and live.

---

## 🚀 Live Demo
🔗 [Visit Wanderlust Website](https://wanderlust-rxie.onrender.com/listings)  

---

## ✨ Features
- 🏠 **Browse Listings** – View all travel destinations with images, descriptions, and prices.
- ➕ **Add New Listings** – Authenticated users can create new travel posts.
- ✏ **Edit / Delete Listings** – Owners can edit or remove their own listings.
- 💬 **Reviews & Ratings** – Users can leave reviews on listings.
- 🔐 **User Authentication** – Sign up / log in using **Passport.js**.
- 📸 **Image Upload** – Upload listing images using **Cloudinary**.
- 📱 **Responsive Design** – Works on all devices.

---

## 🛠 Tech Stack
**Frontend:**
- EJS (Embedded JavaScript Templates)
- HTML5, CSS3, Bootstrap

**Backend:**
- Node.js
- Express.js

**Database:**
- MongoDB + Mongoose

**Authentication:**
- Passport.js (Local Strategy)

**Other Tools & APIs:**
- Cloudinary (Image Hosting)
  
---

## 📦 Installation & Setup
1. Clone the repository:
```bash
   git clone https://github.com/YourUsername/wanderlust.git
```
2. Navigate to the project folder:
```bash
   cd wanderlust
```
3. Install dependencies:
```bash 
  npm install
```
4. Create a .env file and add:
```bash
   CLOUD_NAME=your_cloud_name
   CLOUD_API_KEY=your_key
   CLOUD_API_SECRATE=your_secret
   ATLASDB_URL=your_atlas_url
   SESSION_SECRET=your_secret_key
```
5. Run the app:
```bash
npm start
```
6. Visit:
```bash
http://localhost:8000/listings
```
