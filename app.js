const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express()


const port = 3000

app.get('/',(req,res)=>{
    res.render('index.ejs')
})

const server = app.listen(port,()=>{
    console.log('le serveur marche ')
})
