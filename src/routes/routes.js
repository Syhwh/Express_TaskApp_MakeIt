const { Router } = require('express');
const router = Router();
const cookieSession = require('cookie-session');
const Note = require('../database/models/Note');
const md = require('marked');

const requireUser = (req, res, next) => {   
    if (!res.locals.user) {
        return res.redirect('/login');
    }
    next();
}



// Show the task list
router.get('/', requireUser, async (req, res) => {   
    const notes = await Note.find({ user: res.locals.user});
    res.render('index', { notes })

});

// Show the form to create a note
router.get('/notes/new', requireUser, async (req, res) => {
    const notes = await Note.find({user: res.locals.user});
    res.render('newTask', { notes })
})

// Create a new note
router.post('/notes', requireUser, async (req, res, next) => {
   
    const data = {
        title: req.body.noteTitle,
        body: req.body.noteBody,
        user: res.locals.user
    }
    console.log('local user en post----->'+ data);
    try {
        const note = new Note(data);
        await note.save();
    } catch (e) {
        return next(e);
    }
    res.redirect("/");
});
// Show a note
router.get('/notes/:id', requireUser, async (req, res) => {
    const notes = await Note.find({user: res.locals.user});
    const note = await Note.findById(req.params.id);
    res.render('show', { notes: notes, currentNote: note, md: md })
})

// Show the form to edit
router.get("/notes/:id/edit", requireUser, async (req, res, next) => {
    try {
        const notes = await Note.find({user: res.locals.user});
        const note = await Note.findById(req.params.id);
        res.render('edit', { notes: notes, currentNote: note })
    } catch (e) {
        return next(e)
    }
})

//
router.patch("/notes/:id", requireUser, async (req, res, next) => {
    const id = req.params.id;
    console.log(req.body)
    const note = await Note.findById(id);
    note.title = req.body.noteTitle;
    console.log(req.body.noteTitle)
    note.body = req.body.noteBody;
    console.log(req.body.noteBody)
    try {
        await note.save({});
        res.status(204).send({});
    } catch (e) {
        return next(e);
    }

})

router.delete("/notes/:id", requireUser, async (req, res, next) => {
    try {
        await Note.deleteOne({ _id: req.params.id })
        res.status(204).send({});
    } catch (e) {
        return next(e)
    }
})


module.exports = router;