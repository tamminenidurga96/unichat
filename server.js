const express = require('express');
const mongoose = require('mongoose');
const Registeruser = require('./model');
const jwt = require('jsonwebtoken');
const middleware = require('./middleware');
const Msgmodel = require('./Msgmodel');
const cors = require('cors');

const app = express();

// Middleware to handle JSON
app.use(express.json());
app.use(cors({ origin: "*" }));

// MongoDB URI (Including username and password directly)
const MONGO_URI = 'mongodb+srv://tidurga8639ta:u4wtWVxdtR0KABSl@tammi.ucmys.mongodb.net/?retryWrites=true&w=majority&appName=Tammi';

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

// Call the connection function
connectDB();

// User registration endpoint
app.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmpassword } = req.body;

    // Check if the user already exists
    let exist = await Registeruser.findOne({ email });
    if (exist) {
      return res.status(400).send('User already exists');
    }

    // Check if passwords match
    if (password !== confirmpassword) {
      return res.status(400).send('Passwords do not match');
    }

    // Save the user with plain text password (for demonstration purposes)
    let newUser = new Registeruser({
      username,
      email,
      password, // Saving plain text password
    });
    await newUser.save();
    res.status(200).send('Registered successfully');
  } catch (err) {
    console.log(err);
    return res.status(500).send('Internal server error');
  }
});

// User login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let exist = await Registeruser.findOne({ email });

    if (!exist) {
      return res.status(400).send('User not found');
    }

    // Compare plain text passwords
    if (exist.password !== password) {
      return res.status(400).send('Invalid credentials');
    }

    let payload = {
      user: {
        id: exist.id,
      },
    };

    // Use the environment variable for the JWT secret
    jwt.sign(payload, 'jwtSecret', { expiresIn: '360000' }, (err, token) => {

      if (err) {
        console.error('Error signing token:', err);
        return res.status(500).send('Error signing token');
      }
      return res.json({ token });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error');
  }
});

// Protected route to fetch user profile
app.get('/myprofile', middleware, async (req, res) => {
  try {
    let exist = await Registeruser.findById(req.user.id);
    if (!exist) {
      return res.status(400).send('User not found');
    }
    res.json(exist);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Server error')

  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

app.post('/addmsg', middleware,async(req, res) => {
  try{
    const {text} = req.body;
    const exist = await Registeruser.findById(req.user.id);
    let newmsg= new Msgmodel({
      user : req.user.id,
      username : exist.username,
      text

    })
    await newmsg.save();
    let allmsg = await Msgmodel.find();
    return res.json(allmsg)
   }
   catch(err){
      console.log(err);
      return res.status(500),send('server error')
   }
})
app.get('/getmsg', middleware,async(req, res)=>{
  try{
    let allmsg = await Msgmodel.find();
    return res.json(allmsg)
  }
  catch(err){
    console.log(err);
    return res.status(500),send('server error')
  }

})