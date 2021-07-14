let express = require('express');
let router = express.Router();
let Remark = require('../models/remarks');
let Event = require('../models/events');

//render remarks edit form
router.get('/:id/edit', (req, res, next) => {
    let id = req.params.id;
    Remark.findById(id, (err, remark) => {
        if(err) return next(err);
        res.render('remarkEditForm', {remark});
    })
});

//update remarks
router.post('/:id', (req, res, next) => {
    let id = req.params.id;
    Remark.findByIdAndUpdate(id, req.body, (err, remark) => {
        console.log('/events/' + remark.eventId);
        if(err) return next(err);
        res.redirect('/events/' + remark.eventId);
    })
});

//delete remarks
router.get('/:id/delete', (req, res, next) => {
    let id = req.params.id;
    Remark.findByIdAndDelete(id, (err, remark) => {
        if(err) return next(err);
        Event.findByIdAndUpdate(remark.eventId, {$pull: {remarks: remark.id}}, (err, event) => {
            if(err) return next(err);
            res.redirect('/events/' + remark.eventId);
        })
    })
});

//increment like
router.get('/:id/likes', (req, res, next) => {
    let id = req.params.id;
    Remark.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, remark) => {
        if(err) return next(err);
        res.redirect('/events/' + remark.eventId);
    })
});

//decrement likes
router.get('/:id/dislikes', (req, res, next) => {
    let id = req.params.id;
    Remark.findByIdAndUpdate(id, {$inc: {likes: -1}}, (err, remark) => {
        if(err) return next(err);
        res.redirect('/events/' + remark.eventId);
    })
});

module.exports = router;