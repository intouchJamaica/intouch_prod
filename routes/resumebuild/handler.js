if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const buildFunc = require('./builder.js')
const sessionKey = process.env.SESSION_SECRET
const express = require('express');
const fetchers = require('../../fetchers');
const cookie = require('cookie');
const sessions = require('express-session');
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));



router.get('/create/templates', (req,res)=>{
    var session = req.session;
    session.last_visit = req._parsedOriginalUrl.href
    if(session.userID){
        res.render('./resume/choose-template',{
            get_start:null,
            access:'common',
            user:{
                fname:session.userFNAME,
            }
        })
    }else{
        res.render('./resume/choose-template',{
            get_start:true,
            access:'common'
        })
    }

})

router.get('/create/build', async (req,res)=>{
    var getTemp = req._parsedOriginalUrl.query;
    var san = parseInt(getTemp.replace('useTemp=',''));
    var result = await buildFunc.tSorter(san);

    if(result.ok){
        res.render('./resume/builder', {templatePath:`../resume/_templates/${result.path}`, cssPath:`/css/resume/__templates/template1.css`});
    }else{
        res.redirect('/main/home')
    }
})

router.get('/create/landing', async(req,res)=>{
    var session = req.session;
    session.last_visit = req._parsedOriginalUrl.href
    if(session.userID){
        res.render('./resume/resumelanding',{
            get_start:null,
            access:'common',
            user:{
                fname:session.userFNAME,
            }
        })
    }else{
        res.render('./resume/resumelanding',{
            get_start:true,
            access:'common'
        })
    }
})


router.post('/create/build/complete', async (req,res)=>{
    var result = await buildFunc.pdfGen(req.body.html);
    res.download(result.file)
})


module.exports = router