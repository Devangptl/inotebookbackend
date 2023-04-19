const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// ROUTE 1 :  Get all notes  using: GET /api/notes/fetchallnotes -- login required
router.get('/fetchallnotes' , fetchuser , async (req, res)=>{

    try {
        const notes = await Note.find({user : req.user.id})
        res.json(notes)
        
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server error")
    }
})

// ROUTE 2 :  add new note using: POST /api/notes/addnote -- login required
router.post('/addnote' , fetchuser ,[
    body('title','Enter a valid name').isLength({ min: 3 }),
    body('description','description must be atleast 5 length').isLength({ min: 5 }),
  ], async (req, res)=>{
   
    try {
        
  
    const {title,description,tag} = req.body

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const note = new Note({
    title,description,tag,user:req.user.id
  })

  const saveNote = await note.save()
    res.json(saveNote)
} catch (error) {
    console.error(error.message)
    res.status(500).send("Internal Server error")
}
})


// ROUTE 3 : update and existing note using: PUT /api/notes/updatenote -- login required

router.put('/updatenote/:id' , fetchuser , async (req, res)=>{
    const {title,description,tag} = req.body

    try {
        
  
    // create new note object
    const newNote = {};
    if(title){newNote.title = title}
    if(description){newNote.description = description}
    if(tag){newNote.tag = tag}

    //find the note to be updated
    let note = await Note.findById(req.params.id)

    if(!note){req.status(404).send("Not Found")}

    if(note.user.toString() != req.user.id){
        return res.status(401).send("Not Allowed")
    }

    note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json({note})
} catch (error) {
    console.error(error.message)
    res.status(500).send("Internal Server error")   
}
  })


// ROUTE 4 : Delete and existing note using: DELETE /api/notes/deletenote -- login required

router.delete('/deletenote/:id' , fetchuser , async (req, res)=>{
 

    try {
    //find the note to be delete
    let note = await Note.findById(req.params.id)
    if(!note){
        return res.status(404).send("Not Found")
    }

    //allow only user owns notes
    if(note.user.toString() != req.user.id){
        return res.status(401).send("Not Allowed")
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"Success" : "Note has been deleted" , note:note})
} catch (error) {
    console.error(error.message)
    res.status(500).send("Internal Server error")
}
  })


module.exports = router