//import { create } from 'ipfs-http-client'
const ipfsClient = require('ipfs-http-client')
const express = require('express');
const bodyParse = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');


//const ipfs = new ipfsClient.create({ host: 'localhost', port: '5001', protocol: 'http' })

const ipfs = new ipfsClient.create(new URL('http://18.209.211.244:5001'))


const app = express();


app.set('view engine', 'ejs');
app.use(bodyParse.urlencoded({extended:true}));
app.use(fileUpload());

app.get('/',(req,res) => {
    res.render('home');
})


app.post('/upload', (req,res) => {
   const file = req.files.file;
   const fileName = req.body.fileName;
   const filePath = 'files/' + fileName;
   file.mv(filePath, async(err) => {
    if(err){
        console.log("error");

    }
const fileHash = await addFile(fileName,filePath);
fs.unlink(filePath,(err)=>{
    if(err) console.log(err);
});
res.render('upload', {fileName,fileHash});
   });
});



const addFile = async(fileName , filePath) => {
   const file  = fs.readFileSync(filePath);
   const fileAdded = await ipfs.add({path: fileName , content: file});
   console.log(fileAdded.cid);

   const fileHash = fileAdded.cid;
 
   return fileHash
};

app.listen(3000, () =>{
    console.log("server running at 3000" );
});