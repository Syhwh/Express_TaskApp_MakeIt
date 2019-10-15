const path= require ('path')
const config={
port: process.env.PORT || 3000,
views:path.join(__dirname,'../views'),
viewEngine:'pug', 
static: path.join(__dirname,'../public'),
cookieSession:{
    secret:'secret Key',
    maxAge:24*60*60*1000
},
mongoose:{
    db: 'mongodb://localhost:27017/notes'
}
}
module.exports=config;