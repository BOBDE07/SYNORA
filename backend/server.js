import 'dotenv/config'
import express from 'express' ; 
import connectDB from './src/db/db.js';
import userRouter from './src/routes/user.route.js';

connectDB() ;

const app = express() ; 
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/user', userRouter ) ;

app.get('/' , (req , res) => {
    res.send('backend is running...') ; 
}) ; 

app.listen(PORT , () => {
    console.log(`Server is running on port: ${PORT}`) ;
}) ;
