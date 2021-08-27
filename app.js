import { PDFDocument, StandardFonts, rgb, degrees } from 'https://cdn.skypack.dev/pdf-lib@';


async function createDoc(county, name, code) {
  // Load an existing PDFDocument
  const existingPdfBytes = await Deno.readFile('your-appt.pdf')
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Update page 2 (zero indexed)
  const page2 = pdfDoc.getPage(1);

  page2.drawText(`This booklet was prepared for ${name}.`, {
    x: 40,
    y: 530,
    size: 16,
    color: rgb(1, 0.509, 0.149),
    font: helveticaFont,
  });

  page2.drawText(`Personalised details are available at breastcancernow.org.uk/${code}`, {
    x: 40,
    y: 510,
    size: 10,
    color: rgb(0.5, 0.5, 0.5),
    font: helveticaFont,
  });

  // Update page 17 (zero indexed)
  const page17 = pdfDoc.getPage(16);

  page17.drawText('Visit', {
    x: 90,
    y: 100,
    size: 10,
    color: rgb(0.5, 0.5, 0.5),
    font: helveticaFont,
  });

  page17.drawText('breastcancercare.org.uk/' + county, {
    x: 111,
    y: 100,
    size: 10,
    color: rgb(1, 0.509, 0.149),
    font: helveticaBoldFont,
  });

  return pdfDoc.save();
}

async function handleRequest(request) {
  const u=new URL(request.url);
  const county = u.searchParams.get('county');
  const name = u.searchParams.get('name');
  const code = u.searchParams.get('code');
  const pdfDoc = await createDoc(county, name, code);
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