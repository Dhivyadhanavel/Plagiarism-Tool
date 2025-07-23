
const fs=require('fs')
const mammoth=require('mammoth')


const data=fs.readFileSync("./output/ExportPDFToDOCX/export2025-03-03T22-51-21.docx")
    
    mammoth.extractRawText({buffer:data})
    .then(res=>console.log(res.value))
    .catch(e=>console.log(e))
