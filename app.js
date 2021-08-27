import { PDFDocument, StandardFonts, rgb, degrees } from 'https://cdn.skypack.dev/pdf-lib@';


async function createDoc(county) {
  // Load an existing PDFDocument
  const existingPdfBytes = await Deno.readFile('your-appt.pdf')
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  // Update page 17 (zero indexed)
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

  page.drawText('breastcancercare.org.uk/' + county, {
    x: 111,
    y: 100,
    size: 10,
    color: rgb(1, 0.509, 0.149),
    font: helveticaBoldFont,
  });

  return pdfDoc.save();
}

async function handleRequest(request) {
  var county = 'cornwall';
  if (request.url.search('/county/') > -1) {
    var county = request.url.split('/county/')[1];
  }
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