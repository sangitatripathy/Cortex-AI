import fs from "fs"
import { PDFParse } from "pdf-parse"

export const pdfRag = (state) =>{
  try {
    const buffer = fs.readFileSync(state.file.path)
    const pdf = new PDFParse({
      data: buffer
    })
    
  } catch (error) {
    
  }
}



