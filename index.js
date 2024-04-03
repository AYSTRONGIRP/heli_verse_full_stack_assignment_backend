const express = require('express');
const cors = require("cors");
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const db_link = process.env.db
// console.log(db_link)
// const newUpload = require('./routes/newUpload')
// const showPhotoes = require('./routes/showPhotoes')
mongoose.connect(db_link).then(()=>{console.log("connection done")});
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
// app.use('/assets', express.static(path.join(__dirname, 'assets')));
// app.use(cors());
// app.use(express.static("./public"));
app.use(cors());
// app.use(express.json()); // Add this line to parse JSON in the request body
// app.use(express.urlencoded({ extended: true }));
// app.use('/newUpload',newUpload)
// app.use('/showPhotoes',showPhotoes)
// var storage = multer.diskStorage({

// destination: "./public/images",
// filename: function (req, file, cb) {
// cb(null, Date.now() + '-' +file.originalname )
// }
// })

// var upload = multer({ storage: storage }).array('file');

// app.post('/upload',function(req, res) {
//     console.log('upload')
//     upload(req, res, function (err) {
//            if (err instanceof multer.MulterError) {
//                return res.status(500).json(err)
//            } else if (err) {
//                return res.status(500).json(err)
//            }
//       return res.status(200).send(req.file)
    
//     })
    
// });

const newUserSchema = new mongoose.Schema({
    name :String,
    email:String,
    password:String,
})

const Schema = mongoose.Schema;
    const yourSchema = new Schema({
      // Define the schema fields based on your JSON data structure
      // Example:
      id: Number,
      first_name: String,
      last_name: String,
      email: String,
      gender: String,
      avatar: String,
      domain: String,
      available: Boolean
    });

    const teamSchema = new mongoose.Schema({
      members:[String]
  });

  const team = mongoose.model('Team', teamSchema);



const member = mongoose.model('members', yourSchema);


const User = new mongoose.model("newUser",newUserSchema)

// testUser.save().then(() => {console.log("data saved")})
// .catch(err => {console.log(err)})

const getUser = async (email,password) => {
    const result = await User.find({"email":email , "password":password})
    // console.log("result",result)
    // console.log(result[0].name)
    return result;
}

const getMember = async (body) => {
    console.log(body)
    const result = await member.find({id:body.id}).limit(20);
    // console.log("result",result)
    // console.log(result[0].name)
    return result;
}

const createUser = async (name , email,password) => {
    const testUser = new User({
        name : name,
        email : email,
        password : password,
    })
    try{
        const res = await testUser.save()
    // console.log(testUser)
    // console.log(res)

    const result = await User.find({"email":email , "password":password})

    // console.log(result)
    
    return res;
    }
    catch (err) {
        console.error(err)
        return null;
    }
    
}



  app.post('/api/team', (req, res) => {
    // Retrieve selected users from the request body
    const selectedUsers = req.body.selectedMembers;
    console.log(selectedUsers)
    // Create a new team with the selected unique users

  //   const testUser = new team({
      
  // })

    const newTeam = new team({
        // id: generateUniqueId(), // Generate a unique ID for the team
        members: selectedUsers,
    })

    console.log(newTeam);
    newTeam.save();

    // You can save the new team to a database here or perform any other necessary actions

    res.status(201).json(newTeam); // Respond with the created team
});

app.get('/api/team/', async (req, res) => {
  console.log(req);
  try {
    // Retrieve all teams from the database
    const teams = await team.find();
    console.log(teams);
    // Send the list of teams as JSON response
    res.status(200).json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    // Send an error response if something goes wrong
    res.status(500).json({ error: 'Internal server error' });
  }
});

  app.get('/api/team/:id', (req, res) => {
    const teamId = req.params.id;

    // Logic to retrieve team details by ID
    // You can query the database or any other storage mechanism to retrieve the team details
    
    // Example: Assuming teams are stored in an array
    const team_curr = team.find(team => team.id === teamId);

    if (!team_curr) {
        return res.status(404).json({ error: 'Team not found' });
    }

    res.status(200).json(team_curr); // Respond with the team details
});

  app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, gender, avatar, domain, available } = req.body;
    console.log(req.body);
    try {
        // Find the index of the user with t
        const updatedDocument = await member.findOneAndUpdate(
            { id: id }, // Query
            { $set: { first_name, last_name, email, gender, avatar, domain, available } }, // Update fields
            { new: true } // Return the updated document
        );

        res.status(200).json({ message: 'User updated successfully', user: updatedDocument });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

  app.get('/api/users/:id', async (req, res) => {
    // console.log(req)
    console.log(req.params.id)
    try {
      const member_found = await member.find({id:req.params.id});
      console.log(member_found)
      res.send(member_found);
    } catch (err) {
        
    }
  });
  
app.post('/login',async (req, res)=>{
    // console.log(req.query);
    console.log("body 1" , req.body);
    const val = await getUser(req.body.email , req.body.password)
    console.log(val)
    if(val)
    res.send(val[0]._id)
    else
    res.send("")
})

app.post('/register',async(req, res)=>{
    console.log(req.data)
    const userNow = await createUser(req.body.name ,req.body.email , req.body.password)
    if(userNow){
    console.log(userNow._id)
    res.send(userNow._id)
    } 
    else{
        console.log("errrrr")
    }
})


const paginateResults = () => {
  return async (req, res, next) => {
    // const page = parseInt(req.body.page); as
    const {domain, gender, availability } = req.query;
    console.log(req.query)
    console.log(req.url)
    // console.log(page);
    const limit = parseInt(20);
    const { page } = req.query;

    const filter = {};

        if (domain) {
            filter.domain = domain;
        }

        if (gender) {
            filter.gender = gender;
        }

        if (availability) {
            filter.available = availability;
        }

    console.log('Page number:', page);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < await member.countDocuments(filter).exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      };
    }

    try {
      results.results = await member.find(filter).limit(limit).skip(startIndex).exec();
      res.paginatedResults = results;
      next();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
};

app.get('/api/users', paginateResults(), (req, res) => {
  console.log(req.body) 
  res.json(res.paginatedResults);
  });

  app.delete('/api/users/:id', async (req, res) => {
    // Accessing id from req.params
    try {
        const deletedMember = await member.findOneAndDelete({ id: req.params.id }); // Finding and deleting member by _id
        if (!deletedMember) {
            return res.status(404).send('User not found');
        }
        res.send('User deleted successfully');
    } catch (err) {
        console.error(err); // Logging the error
        res.status(500).send('Server Error'); // Sending a generic server error response
    }
});
// app.get('/members',async(req,res)=>{
//     console.log(req.body)

//     const val = await getMember(req.body)
//     // console.log(val)
//     res.send(val)
// })
    
app.listen(8080);