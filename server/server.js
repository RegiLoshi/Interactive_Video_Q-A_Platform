import app from "./app.js"
import logInController from "./controller/authController.js"
import authenticate_token from "./middlewares/authenticateToken.js"
import answerController from "./controller/answerController.js"
import surveyController from "./controller/surveyController.js"

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
app.post("/survey", authenticate_token, surveyController.addSurvey);
app.post("/answer", authenticate_token, answerController.addAnswer);
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

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})
