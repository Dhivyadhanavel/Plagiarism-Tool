const express=require('express')
const app=express()
const path=require("path")
const cors=require("cors")
const fs=require("fs")
const PORT=process.env.PORT || 5000
const mongoose=require("mongoose")
const User=require('./user')
const session=require('express-session')
const MongoStore=require('connect-mongo')
const axios=require('axios')
const mammoth = require("mammoth");
require("dotenv").config();  // Load environment variables

const MONGO_URI = process.env.MONGO_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;
const ADOBE_CLIENT_ID = process.env.ADOBE_CLIENT_ID;
const ADOBE_CLIENT_SECRET = process.env.ADOBE_CLIENT_SECRET;
const {
    ServicePrincipalCredentials,
    PDFServices,
    MimeType,
    ExportPDFJob,
    ExportPDFParams,
    ExportPDFTargetFormat,
    ExportPDFResult
} = require("@adobe/pdfservices-node-sdk");


app.use(cors({
   origin:function(origin,callback){
    callback(null,origin||"*")
   },
    
    credentials:true
}))



app.use(session({
    secret:SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    
    store: MongoStore.create({mongoUrl : MONGO_URI}),
    cookie:{
        
        secure: process.env.NODE_ENV === "production",  // Set to true in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
        
    
    }

}))




mongodb().catch((e)=>console.log(e))

async function  mongodb(){
 await mongoose.connect(MONGO_URI)
}

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const multer=require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/signin",async (req,res)=>{
    let {username,password}=req.body

    const pass=await User.findOne({username:username}).select("password name")
    
    
    if (pass && pass.password===password){
        req.session.username=username
       
        console.log(req.session)
        res.json({success:true,message:pass.name})
    }
    else{
        res.json({success:false})
    }
    
    
}
    )

app.post("/signup",async (req,res)=>{
    let {name,username,password}=req.body
    if (name==='' || username==='' || password===''){
        res.json({message:'blank space'})
        return}

    const us=await User.findOne({username:username})
    if(!us){
    const users= await User.create({
        name:name,
        username:username,
        password:password
    }).then(console.log("success"))
   
    res.json({success:true})
    }
    else{
        res.json({success:false})
    }
     



   
})

app.post("/text",async (req,res)=>{
    console.log(req.session.username)
    const {text1,text2,title}=req.body
    dt=new Date()
    date=dt.toLocaleDateString()
    time=dt.toLocaleTimeString()
    similarity=0
    
    await axios.post(" http://localhost:8080/getscore",{'text1':text1,'text2':text2},{withCredentials:true})
    .then((response)=>{
        if (response.data.success){
            similarity=response.data.score
        }
    })
    .catch((e)=>console.log(e))
    
    console.log(similarity,req.session.username)
    await User.findOneAndUpdate({username:req.session.username},{$push:{text:{type:'text',title:title,text1:text1,text2:text2,date:date,time:time,score:similarity}}})
    
    res.json({success:true,message:similarity})
})

app.get("/getData",async (req,res)=>{
    const username=req.session.username
    const title=await User.find({username:username}).select("text")
    if (title[0]){
    const data=title[0].text
    const details=[]
    for (i=0;i<data.length;i++){
        details.push([data[i].title,data[i].type])
    }
    res.json({success:true,message:data})}
    else{
        res.json({success:false})
    }
})

app.post('/scorelog',async (req,res)=>{
    const title=req.body['title']
    console.log(req.session.username)
    const logdata=await User.findOne({username:req.session.username,'text.title':title},{'text.$':1})
    console.log(logdata)
    res.json({success:true,message:logdata.toObject()})
})

app.post('/delete',async (req,res)=>{
    const title=req.body.title
    await User.updateOne(
        { username: req.session.username },
        { $pull: { text: { title: title } } }
    );
    res.json({success:true})
})

app.post('/docx',upload.fields([{name:'text'},{ name: "docx1" }, { name: "docx2" }]), async (req, res)=>{
    const title=req.body.text
    const file1 = await extractTextFromDocx2(req.files.docx1[0]);
    const file2 = await extractTextFromDocx2(req.files.docx2[0]);
    dt=new Date()
        date=dt.toLocaleDateString()
        time=dt.toLocaleTimeString()
        similarity=0
        
        
        try {
            const response = await axios.post("http://localhost:8080/getscore", 
                { 'text1':file1,'text2': file2 }, 
                { withCredentials: true }
            );
            if (response.data.success) {
                similarity = response.data.score;
            }
        } catch (error) {
            console.error("Error in plagiarism API:", error);
        }
        
        console.log(similarity,req.session.username)
        await User.findOneAndUpdate({username:req.session.username},{$push:{text:{type:'DOCX',title:req.body.text,text1:file1,text2:file2,date:date,time:time,score:similarity}}})
        

        res.json({ success: true, message:similarity });

    } 

)

app.post("/pdf", upload.fields([{name:'text'},{ name: "pdf1" }, { name: "pdf2" }]), async (req, res) => {
    console.log(req.files.pdf1[0].originalname)
    console.log(req.files.pdf2[0].originalname)
    try {
        if (!req.files || !req.files.pdf1 || !req.files.pdf2) {
            return res.status(400).json({ success: false, message: "Both files are required" });
        }

        // Adobe PDF Services Credentials
        const credentials = new ServicePrincipalCredentials({
            clientId: ADOBE_CLIENT_ID,
            clientSecret:  ADOBE_CLIENT_SECRET
        });

        const pdfServices = new PDFServices({ credentials,timeout: 30000 });

        // Convert PDF to DOCX and extract text
        const text1 = await convertAndExtractText(req.files.pdf1[0], pdfServices);
        const text2 = await convertAndExtractText(req.files.pdf2[0], pdfServices);

        dt=new Date()
        date=dt.toLocaleDateString()
        time=dt.toLocaleTimeString()
        similarity=0
        console.log(text1,text2)
        
        try {
            const response = await axios.post("http://localhost:8080/getscore", 
                { 'text1':text1,'text2': text2 }, 
                { withCredentials: true }
            );
            if (response.data.success) {
                similarity = response.data.score;
            }
        } catch (error) {
            console.error("Error in plagiarism API:", error);
        }
        
        console.log(similarity,req.session.username)
        await User.findOneAndUpdate({username:req.session.username},{$push:{text:{type:'PDF',title:req.body.text,text1:text1,text2:text2,date:date,time:time,score:similarity}}})
        

        res.json({ success: true, message:similarity });

    } catch (err) {
        console.error("Error processing PDFs:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Function to convert PDF to DOCX and extract text
async function convertAndExtractText(pdfFile, pdfServices) {
    try {
        // Upload PDF file to Adobe PDF Services
        const inputAsset = await pdfServices.upload({
            readStream: bufferToStream(pdfFile.buffer),
            mimeType: MimeType.PDF
        });

        // Convert PDF to DOCX
        const params = new ExportPDFParams({ targetFormat: ExportPDFTargetFormat.DOCX });
        const job = new ExportPDFJob({ inputAsset, params });
        const pollingURL = await pdfServices.submit({ job });
        const pdfServicesResponse = await pdfServices.getJobResult({ pollingURL, resultType: ExportPDFResult });

        // Get DOCX content
        const resultAsset = pdfServicesResponse.result.asset;
        const streamAsset = await pdfServices.getContent({ asset: resultAsset });

        // Save DOCX to temp file
        const docxPath = createTempFilePath("docx");
        await streamToFile(streamAsset.readStream, docxPath);

        // Extract text using Mammoth
        const extractedText = await extractTextFromDocx(docxPath);

        // Cleanup: Remove temporary DOCX file
        fs.unlinkSync(docxPath);

        return extractedText;
    } catch (error) {
        console.error("Error converting PDF to text:", error);
        res.json({success:false,message:"Text extraction failed.Error converting PDF to text"} );
    }
}

// Convert buffer to stream
function bufferToStream(buffer) {
    const { Readable } = require("stream");
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
}

// Extract text from DOCX using Mammoth
async function extractTextFromDocx(docxFilePath) {
    try {
        const data = fs.readFileSync(docxFilePath);
        const result = await mammoth.extractRawText({ buffer: data });
        return result.value || "No text extracted.";
    } catch (error) {
        console.error("Error extracting text from DOCX:", error);
        res.json({success:false,message:"Text extraction failed.Error extracting text from DOCX"} );
        
    }
}


async function extractTextFromDocx2(docxFile) {
    try {
        const result = await mammoth.extractRawText({ buffer: docxFile.buffer });
        return result.value || "No text extracted.";
    } catch (error) {
        console.error("Error extracting text from DOCX:", error);
        return "Text extraction failed.";
    }
}

// Generate temp file path
function createTempFilePath(extension) {
    const tempDir = "temp/";
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    return path.join(tempDir, `output_${Date.now()}.${extension}`);
}

// Write stream to file
async function streamToFile(stream, filePath) {
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath);
        stream.pipe(writeStream);
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
    });
}

app.listen(PORT,()=>console.log(`server is listening on port ${PORT}.....`))
