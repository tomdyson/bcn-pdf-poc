// To run this script with Deno:
//   deno run --allow-write https://gist.githubusercontent.com/Hopding/8304b9f07c52904587f7b45fae4bcb8c/raw/pdf-lib-deno-create-script.ts

import { PDFDocument, StandardFonts, rgb, degrees } from 'https://cdn.skypack.dev/pdf-lib@';

// Load an existing PDFDocument
const existingPdfBytes = await Deno.readFile('your-appt.pdf')
const pdfDoc = await PDFDocument.load(existingPdfBytes);

// Draw some text on the first page of the PDFDocument
const page = pdfDoc.getPage(16);

const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

page.drawText('Visit', {
  x: 90,
  y: 100,
  size: 10,
  color: rgb(0.5, 0.5, 0.5),
  font: helveticaFont,
});


page.drawText('breastcancercare.org.uk/oxfordshire', {
  x: 111,
  y: 100,
  size: 10,
  color: rgb(1, 0.509, 0.149),
  font: helveticaBoldFont,
});

// Save the PDFDocument and write it to a file
const pdfBytes = await pdfDoc.save();
await Deno.writeFile('modify.pdf', pdfBytes);

// Done! 💥
console.log('PDF file written to modify.pdf');