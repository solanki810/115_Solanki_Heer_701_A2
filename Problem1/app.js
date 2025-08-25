<<<<<<< HEAD
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public/uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: function (req, file, cb) {
        if (file.fieldname === 'profilePic') {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Profile pic must be an image'));
            }
        }
        if (file.fieldname === 'otherPics') {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Other pics must be images'));
            }
        }
        cb(null, true);
    }
});

app.get('/', (req, res) => {
    res.render('form', { errors: {}, old: {} });
});

app.post('/register', upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'otherPics', maxCount: 5 }
]), (req, res) => {
    const { username, password, confirmPassword, email, gender, hobbies } = req.body;
    let errors = {};
    let old = { ...req.body };

    // Validations
    if (!username || username.length < 3) errors.username = 'Username must be at least 3 characters';
    if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Invalid email';
    if (!gender) errors.gender = 'Gender is required';
    if (!hobbies) errors.hobbies = 'Select at least one hobby';
    if (!req.files['profilePic']) errors.profilePic = 'Profile pic is required';
    if (req.files['profilePic'] && req.files['profilePic'][0].size > 2 * 1024 * 1024) errors.profilePic = 'Profile pic too large (max 2MB)';
    if (req.files['otherPics']) {
        for (let file of req.files['otherPics']) {
            if (file.size > 2 * 1024 * 1024) {
                errors.otherPics = 'One of the other pics is too large (max 2MB)';
                break;
            }
        }
    }

    // If errors, show form again
    if (Object.keys(errors).length > 0) {
        res.render('form', { errors, old });
    } else {
        // Prepare data for result
        res.render('result', {
            data: {
                username,
                email,
                gender,
                hobbies: Array.isArray(hobbies) ? hobbies : [hobbies],
                profilePic: req.files['profilePic'][0].filename,
                otherPics: req.files['otherPics'] ? req.files['otherPics'].map(f => f.filename) : []
            }
        });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
=======
const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public/uploads/'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: function (req, file, cb) {
        if (file.fieldname === 'profilePic') {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Profile pic must be an image'));
            }
        }
        if (file.fieldname === 'otherPics') {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Other pics must be images'));
            }
        }
        cb(null, true);
    }
});

app.get('/', (req, res) => {
    res.render('form', { errors: {}, old: {} });
});

app.post('/register', upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'otherPics', maxCount: 5 }
]), (req, res) => {
    const { username, password, confirmPassword, email, gender, hobbies } = req.body;
    let errors = {};
    let old = { ...req.body };

    // Validations
    if (!username || username.length < 3) errors.username = 'Username must be at least 3 characters';
    if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Invalid email';
    if (!gender) errors.gender = 'Gender is required';
    if (!hobbies) errors.hobbies = 'Select at least one hobby';
    if (!req.files['profilePic']) errors.profilePic = 'Profile pic is required';
    if (req.files['profilePic'] && req.files['profilePic'][0].size > 2 * 1024 * 1024) errors.profilePic = 'Profile pic too large (max 2MB)';
    if (req.files['otherPics']) {
        for (let file of req.files['otherPics']) {
            if (file.size > 2 * 1024 * 1024) {
                errors.otherPics = 'One of the other pics is too large (max 2MB)';
                break;
            }
        }
    }

    // If errors, show form again
    if (Object.keys(errors).length > 0) {
        res.render('form', { errors, old });
    } else {
        // Prepare data for result
        res.render('result', {
            data: {
                username,
                email,
                gender,
                hobbies: Array.isArray(hobbies) ? hobbies : [hobbies],
                profilePic: req.files['profilePic'][0].filename,
                otherPics: req.files['otherPics'] ? req.files['otherPics'].map(f => f.filename) : []
            }
        });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
>>>>>>> 7c551cd (Problem 3 - Express login with Redis session)
