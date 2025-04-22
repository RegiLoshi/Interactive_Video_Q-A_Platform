import app from "./app.js"
import authRoutes from './routes/authRoutes.js'
import surveyRoutes from './routes/surveyRoutes.js'
import userRoutes from './routes/userRoutes.js'
import answerRoutes from './routes/answerRoutes.js'

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log('Cookies received:', req.cookies);
  next();
});

app.get("/", (req, res) => {
    return res.send("Hello World");
})

app.use('/auth', authRoutes);
app.use('/surveys', surveyRoutes);
app.use('/answers', answerRoutes);
app.use('/users', userRoutes);

    
// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})
