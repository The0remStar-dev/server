const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express()

app.set('view engine', 'ejs');
app.set('views', __dirname);

const port = 3000
user=[]

app.get('/',(req,res)=>{
    res.render('index.ejs')
})
app.get('/login',(req,res)=>{
    res.render('login.ejs')
})
app.get('/register',(req,res)=>{
    res.render('register.ejs')
})
const server = app.listen(port,()=>{
    console.log('le serveur marche ')
})