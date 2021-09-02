import { PDFDocument, StandardFonts, rgb, degrees } from 'https://cdn.skypack.dev/pdf-lib@';
import fontkit from 'https://cdn.skypack.dev/@pdf-lib/fontkit';

async function createDoc(county) {
  // Load an existing PDFDocument
  const existingPdfBytes = await Deno.readFile('your-appt.pdf');
  const fontBytes = await Deno.readFile('WorkSans-SemiBold.ttf');
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  // Embed BCN's font
  pdfDoc.registerFontkit(fontkit);
  const workSansMediumFont = await pdfDoc.embedFont(fontBytes);
  // const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  // const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Update page 17 (zero indexed)
  const page17 = pdfDoc.getPage(23);

  // Draw a white background over the old link
  page17.drawRectangle({
    x: 310,
    y: 175,
    width: 390,
    height: 22,
    color: rgb(1, 1, 1),
  });

  // Draw the new link
  page17.drawText('breastcancernow.org/' + county, {
    x: 310,
    y: 180,
    size: 16,
    color: rgb(0.92, 0.106, 0.337),
    font: workSansMediumFont,
  });

  return pdfDoc.save();
}

async function handleRequest(request) {
  const u=new URL(request.url);
  const county = u.searchParams.get('county');
  const pdfDoc = await createDoc(county);
  return new Response(
    pdfDoc,
    {
      headers: {
        "content-type": "application/pdf; charset=UTF-8",
        "content-length": pdfDoc.length,
      },
    },
  );
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});