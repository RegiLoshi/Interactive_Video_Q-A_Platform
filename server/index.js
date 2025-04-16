import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logInController from './controller/authController.js';
import authenticate_token from './middlewares/authenticateToken.js';
import surveyController from './controller/surveyController.js';
const app = express();

const corsOptions = {
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Add test endpoint
app.get('/test-connection', (req, res) => {
    console.log('Test connection request received');
    res.json({ message: 'Server is accessible', timestamp: new Date().toISOString() });
});

// Add request logging middleware
app.use((req, res, next) => {
    console.log('Incoming request:', {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
        cookies: req.cookies,
        ip: req.ip
    });
    next();
});

// Routes
app.get("/", (req, res) => {
    return res.send("Hello World");
});

app.get("/users", authenticate_token, logInController.getUsers);
app.get("/survey", authenticate_token, surveyController.getSurveys);
app.post("/survey", authenticate_token, surveyController.addSurvey);
app.post("/signup", logInController.signUp);
app.post("/login", logInController.logIn);
app.post("/refresh", logInController.refreshToken);
app.post("/logout", logInController.logoutUser);
app.post("/requestPassword", logInController.requestPassword);
app.post("/resetPassword", logInController.resetPassword);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 