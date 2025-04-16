import app from "./app.js"
import logInController from "./controller/authController.js"
import authenticate_token from "./middlewares/authenticateToken.js"
import answerController from "./controller/answerController.js"
import surveyController from "./controller/surveyController.js"
import userController from "./controller/userController.js"


import multer from "multer"
const storage = multer.memoryStorage();
const upload = multer({ storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/mp4')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'));
    }
  }
});

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log('Cookies received:', req.cookies);
  next();
});

app.get("/", (req, res) => {
    return res.send("Hello World");
})

app.get("/users", authenticate_token, logInController.getUsers);
app.get("/survey", authenticate_token, surveyController.getSurveys);
app.get("/survey/:id", authenticate_token, surveyController.getSurveysID);
app.post("/survey", authenticate_token,surveyController.addSurvey);
app.delete("/survey", authenticate_token, surveyController.deleteSurvey);
app.post("/answer", authenticate_token,upload.single('video'),  answerController.addAnswer);
app.get("/survey/:id/responses", authenticate_token, answerController.getAnswers);
app.get("/survey/:surveyId/responses/:userId", authenticate_token, answerController.getVideoAnswer);
app.post("/signup", logInController.signUp);
app.post("/login", logInController.logIn);
app.post("/refresh", logInController.refreshToken);
app.post("/logout", logInController.logoutUser);
app.post("/requestPassword", logInController.requestPassword);
app.post("/resetPassword", logInController.resetPassword);
app.get("/users/:id", authenticate_token, userController.getUser);
app.patch("/users/update-profile/:id", authenticate_token, userController.updateProfile)
    
// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})
