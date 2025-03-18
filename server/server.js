import app from "./app.js"
import logInController from "./controller/authController.js"
import authenticate_token from "./middlewares/authenticateToken.js"



const PORT = process.env.PORT || 5000;



app.get("/", (req, res) => {
    return res.send("Hello World");
})

app.get("/users", authenticate_token, logInController.getUsers);
app.post("/signup", logInController.signUp);
app.post("/login", logInController.logIn);
app.post("/refresh", logInController.refreshToken)

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})
