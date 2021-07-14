let express = require('express');
let router = express.Router();
let Event = require('../models/events');
let Remark = require('../models/remarks');


//render create event form
router.get('/new', (req, res, next) => {
    res.render('createEventForm');
});

//create event
router.post('/', (req, res, next) => {
    req.body.categories = req.body.categories.trim().split(" ");
    Event.create(req.body, (err, event) => {
        if(err) return next(err);
        res.redirect('/events');
    })
});

//list all events
router.get('/', (req, res, next) => {
    Event.distinct('categories').exec((err, categories) => {
        if(err) return next(err);
        res.locals.categories = categories;
        Event.distinct('location').exec((err, location) => {
            if(err) return next(err);
            res.locals.location = location;
            Event.find({}, (err, events) => {
                if(err) return next(err);
                 res.render('eventList', {events});      
           });
        });
    }); 
});

//list a specific event
router.get('/:id', (req, res, next) => {
    console.log(res.locals.categories);
    let id = req.params.id;
    console.log(req.body);
    Event.findById(id).populate('remarks').exec((err, event) => {
        if(err) return next(err);
        res.render('eventDetailsPage', {event});
    })
});

//get event edit form
router.get('/:id/edit', (req, res, next) => {
    let id = req.params.id;
    Event.findById(id, (err, event) => {
        if(err) return next(err);
        event.categories = event.categories.join(" ");
        res.render('eventEditForm', {event});
    })
});

//update event
router.post('/:id', (req, res, next) => {
    let id = req.params.id;
    req.body.categories = req.body.categories.trim().split(" ");
    Event.findByIdAndUpdate(id, req.body, (err, event) => {
        if(err) return next(err);
        res.redirect('/events/' + id);
    })
});

//delete event 
router.get('/:id/delete', (req, res, next) => {
    let id = req.params.id;
    Event.findByIdAndDelete(id, (err, event) => {
        if(err) return next(err);
        Remark.deleteMany({eventId: id}, (err, remarks) => {
            if(err) return next(err);
            res.redirect('/events');
        })
       
    })
});

//increment like
router.get('/:id/likes', (req, res, next) => {
    let id = req.params.id;
    Event.findByIdAndUpdate(id, {$inc: {likes: 1}}, (err, event) => {
        if(err) return next(err);
        res.redirect('/events/' + id);
    })
});

//decrement likes
router.get('/:id/dislikes', (req, res, next) => {
    let id = req.params.id;
    Event.findByIdAndUpdate(id, {$inc: {likes: -1}}, (err, event) => {
        if(err) return next(err);
        res.redirect('/events/' + id);
    })
});

//create remarks
router.post('/:id/remarks', (req, res, next) => {
    let id = req.params.id;
    req.body.eventId = id;
    Remark.create(req.body, (err, remark) => {
        if(err) return next(err);
        Event.findByIdAndUpdate(id, {$push: {remarks: remark.id}}, (err, event) => {
            if(err) return next(err);
            res.redirect('/events/' + id);
        })
    })
});

//sort using categories
router.get('/:id/categories', (req, res, next) => {
    let id = req.params.id;
    Event.distinct('categories').exec((err, categories) => {
        if(err) return next(err);
        res.locals.categories = categories;
        Event.distinct('location').exec((err, location) => {
            if(err) return next(err);
            res.locals.location = location;
            Event.find({categories: id},(err, events) => {
                if(err) return next(err);
                res.render('eventList', {events});
            })
        });
    });
    
});

//sort using location
router.get('/:id/location', (req, res, next) => {
    let id = req.params.id;
    Event.distinct('categories').exec((err, categories) => {
        if(err) return next(err);
        res.locals.categories = categories;
        Event.distinct('location').exec((err, location) => {
            if(err) return next(err);
            res.locals.location = location;
            Event.find({location: id}, (err, events) => {
                if(err) return next(err);
                res.render('eventList', {events});
            })
        });
    });
    
    
});

//sort using dates ascending
router.get('/ascending/sort', (req, res, next) => {
    Event.distinct('categories').exec((err, categories) => {
        if(err) return next(err);
        res.locals.categories = categories;
        Event.distinct('location').exec((err, location) => {
            if(err) return next(err);
            res.locals.location = location;
            Event.find({}).sort({startDate: 'asc'}).exec((err, events) => {
                console.log(events);
                if(err) return next(err);
                res.render('eventList', {events});
            })
        });
    }); 
    
});

//sort using dates descending
router.get('/descending/sort', (req, res, next) => {
    Event.distinct('categories').exec((err, categories) => {
        if(err) return next(err);
        res.locals.categories = categories;
    });
    Event.distinct('location').exec((err, location) => {
        if(err) return next(err);
        res.locals.location = location;
    });
    Event.find({}).sort({startDate: 'desc'}).exec((err, events) => {
        console.log(events);
        if(err) return next(err);
        res.render('eventList', {events});
    })
});

module.exports = router;