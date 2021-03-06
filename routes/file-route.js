if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const jobCalls = require('../jobFetchers.js');
const urlHandlers = require('../urlHandlers.js');
const qHandler = urlHandlers.qHandler;
const express = require('express');
const sessions = require('express-session');
const fetchers = require('../fetchers.js');
const router = express.Router();
const bodyParser = require('body-parser');

const path = require('path');
const fs = require("fs");
const multer = require("multer");
const database = require('../database.js');
const upload = require('../helpers/filehelper.js')
const singleFileUpload = require('../controllers/fileHandler.js');
const resumeFile = require('../models/resume.js');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const checkAllowed = (req, res, next)=>{
    var session = req.session;
    if(session.userType === 'client' || session.userType === 'common'){
        next()
    }else{
        res.send({
            status:403,
            message:'Not allowed'
        })
    }
}


router.post('/resume',upload.r_upload.single('resume'), singleFileUpload.resumeUpload);

router.get('/download/resume', checkAllowed, async (req,res)=>{
    var search_path = decodeURIComponent(req._parsedOriginalUrl.query.replace('ref_id=',''));
    console.log(search_path)
    /*resumeFile.find({filePath:req.body.ref_id},(error,data)=>{
        if(error){
            console.log(error)
            res.send({
                error:true,
                message:'File not found'
            })
        }else{
            console.log(fpath)
            var send = data[0];
            var fpath = send.filePath.replace("/\\/g",'/');
        }
    })*/
    res.download(`/${search_path}`, (error)=>{
        console.log(error)
    })
})


router.post('/company-logo', (req,res)=>{
    
})



module.exports = router