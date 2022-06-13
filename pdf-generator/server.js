const app = require('./config/express')();
const puppeteer = require('puppeteer');
const fs = require('fs')

const generatePDF = async (res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const html = fs.readFileSync(`index.html`, 'utf8')

  await page.setContent(html, {
    waitUntil: 'domcontentloaded'
  })

  const pdfBuffer = await page.pdf({ format: 'a4', landscape: true, printBackground: true, scale: 0.6});

  res.set({
    'Content-Type': 'application/pdf',    
    'Content-Disposition': 'attachment; filename=Pdf.pdf',
  });

  res.send(pdfBuffer);

  await browser.close();
}

app.get('/generate-pdf', (req, res) => generatePDF(res));

app.listen(3000, () => {
    console.log(`Server runing on port 3000`);
});