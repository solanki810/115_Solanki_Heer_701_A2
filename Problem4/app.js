const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const path = require('path');
const Employee = require('./models/Employee');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'erp_admin_secret',
    resave: false,
    saveUninitialized: false
}));

mongoose.connect('mongodb://localhost:27017/erp_system');

// ...routes will be added here...
// Admin credentials (for demo)
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

// Middleware to check admin session
function isAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) return next();
    res.redirect('/login');
}

// Login routes
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        req.session.isAdmin = true;
        res.redirect('/dashboard');
    } else {
        res.render('login', { error: 'Invalid credentials' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Dashboard
app.get('/dashboard', isAdmin, (req, res) => {
    res.render('dashboard');
});

// Employee CRUD
app.get('/employees', isAdmin, async (req, res) => {
    const employees = await Employee.find();
    res.render('employees', { employees });
});

app.get('/employees/new', isAdmin, (req, res) => {
    res.render('new_employee');
});

function generateEmpId() {
    return 'EMP' + Math.floor(1000 + Math.random() * 9000);
}

function generatePassword() {
    return Math.random().toString(36).slice(-8);
}

function calculateSalary(basic, hra, da) {
    return Number(basic) + Number(hra) + Number(da);
}

// Add employee
app.post('/employees', isAdmin, async (req, res) => {
    const { name, email, basic, hra, da } = req.body;
    const empid = generateEmpId();
    const rawPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const salary = calculateSalary(basic, hra, da);
    const employee = new Employee({ empid, name, email, password: hashedPassword, basic, hra, da, salary });
    await employee.save();

    // Send email to employee
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your_email@gmail.com', // replace with your email
            pass: 'your_email_password'   // replace with your email password or app password
        }
    });
    let mailOptions = {
        from: 'your_email@gmail.com',
        to: email,
        subject: 'Welcome to ERP',
        text: `Hello ${name},\nYour Employee ID: ${empid}\nPassword: ${rawPassword}`
    };
    transporter.sendMail(mailOptions, (err, info) => {
        // Ignore errors for demo
    });

    res.redirect('/employees');
});

// Edit employee
app.get('/employees/:id/edit', isAdmin, async (req, res) => {
    const employee = await Employee.findById(req.params.id);
    res.render('edit_employee', { employee });
});

app.post('/employees/:id', isAdmin, async (req, res) => {
    const { name, email, basic, hra, da } = req.body;
    const salary = calculateSalary(basic, hra, da);
    await Employee.findByIdAndUpdate(req.params.id, { name, email, basic, hra, da, salary });
    res.redirect('/employees');
});

// Delete employee
app.post('/employees/:id/delete', isAdmin, async (req, res) => {
    await Employee.findByIdAndDelete(req.params.id);
    res.redirect('/employees');
});

// Redirect homepage to login
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.listen(3000, () => {
    console.log('ERP Admin Panel running on http://localhost:3000');
});
