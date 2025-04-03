import app from "./app.js"
import logInController from "./controller/authController.js"
import authenticate_token from "./middlewares/authenticateToken.js"

const PORT = process.env.PORT || 3000;


app.use((req, res, next) => {
  console.log('Cookies received:', req.cookies);
  next();
});

app.get("/", (req, res) => {
    return res.send("Hello World");
})

app.get("/users", authenticate_token, logInController.getUsers);
app.post("/signup", logInController.signUp);
app.post("/login", logInController.logIn);
app.post("/refresh", logInController.refreshToken);
app.post("/logout", logInController.logoutUser);
app.post("/requestPassword", logInController.requestPassword);
app.post("/resetPassword", logInController.resetPassword);

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})
