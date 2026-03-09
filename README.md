# ChatBot Backend

Backend API for a full-stack chatbot application built using **Node.js, Express, and MongoDB**.  
This backend handles authentication, conversation management, and message storage.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- REST API

## Features

- User Signup and Login
- Secure Authentication using JWT
- Create and manage conversations
- Store chat messages in MongoDB
- Fetch conversation history
- User profile data with conversation statistics

## Project Structure
models/
routes/
middleware/
config/
server.js


## Installation

Clone the repository

```bash
git clone https://github.com/sarthak-goswami/MyChatBot-backend
cd MyChatBot-backend

npm install
```

## Create a .env 
```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```
## Run Server
```
npm start
```

Server will run on 
http://localhost:5000

## API Endpoints

### Authentication
POST /api/auth/signup\
POST /api/auth/login

### Conversations
GET /api/conversations\
POST /api/conversations\
GET /api/conversations/:id

### Messages
POST /api/messages\
GET /api/messages/:conversationId

# Author - Sarthak Goswami

GitHub:
https://github.com/sarthak-goswami