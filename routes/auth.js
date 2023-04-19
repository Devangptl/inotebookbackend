const express = require('express');
const User = require('../models/User');
const router = express.Router(); 
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = 'Devangisgoodb$oy'

// ROUTE 2 :  Create a User using: POST /api/auth/createuser -- no login required

router.post('/createuser' ,[
  body('name','Enter a valid name').isLength({ min: 2 }),
  body('email','Enter a valid email').isEmail(),
  body('password','Password must be atleast 5 length').isLength({ min: 5 }),
], async(req, res)=>{ 
  let success = false;
  //if there are error , return bad request and error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  //check wether the user with email exists already 

  try{

 
  let user = await User.findOne({email:req.body.email})
  if(user){
    return res.status(400).json({success, error : " Sorry a user with this email already exists"})
  }
  // create new user
  const salt =  await bcrypt.genSalt(10)
  const secPass = await bcrypt.hash(req.body.password , salt) 

  user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: secPass,
  })

  const data = {
    user:{
      id:user.id
    }
  }

 const authtoken = jwt.sign(data,JWT_SECRET)
  // res.json(user)
  success = true;
  res.json( {success, authtoken})
}
//catch error
catch(error){
  console.error(error.message)
  res.status(500).send("Internal Server error")
}
 
} )


// ROUTE 2 :  Authentication a User using: POST /api/auth/login 

router.post('/login' ,[
  body('email','Enter a valid email').isEmail(),
  body('password','Password cannot be blank').exists(),

], async(req, res)=>{ 
  let success = false;
    //if there are error , return bad request and error

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email,password} = req.body;

  try {
    let user = await User.findOne({email})
    if(!user){
      return res.status(400).json({error : "Please try to login with correct credentials"})
    }

    const passwordcompare = await bcrypt.compare(password,user.password)
    if(!passwordcompare){
      success = false;
      return res.status(400).json({success ,error : "Please try to login with correct credentials"})
    }

    const data = {
      user:{
        id:user.id
      }
    }
    
 const authtoken = jwt.sign(data,JWT_SECRET)
 success = true;
 res.json({success ,authtoken})

  } catch (error) {
    console.error(error.message)
    res.status(500).send("Internal Server error")
  }


})


// ROUTE 3 :  Get login user details  using: POST /api/auth/getuser -- login required

router.post('/getuser', fetchuser , async(req, res)=>{

try {
   const userId = req.user.id
  const user = await User.findById(userId).select("-password")
  res.send(user)
} catch (error) {
  
  console.error(error.message)
  res.status(500).send("Internal Server error")
}
})


module.exports = router