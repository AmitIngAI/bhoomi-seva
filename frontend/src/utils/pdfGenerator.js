import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const downloadPDF = async (elementRef, filename = "document.pdf") => {
  if (!elementRef.current) {
    alert("Document not ready");
    return;
  }

  try {
    const element = elementRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth - 10;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 5;

    pdf.addImage(imgData, "PNG", 5, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 5, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
    return true;
  } catch (err) {
    console.error("PDF generation error:", err);
    alert("Failed to generate PDF");
    return false;
  }
};

export const printDocument = (elementRef) => {
  if (!elementRef.current) return;

  const printWindow = window.open("", "_blank");
  const content = elementRef.current.innerHTML;

  printWindow.document.write(`
    <html>
      <head>
        <title>Document Print</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page { size: A4 landscape; margin: 10mm; }
          body { font-family: 'Noto Sans Devanagari', sans-serif; }
        </style>
      </head>
      <body>${content}</body>
    </html>
  `);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};

export const shareDocument = async (title, text) => {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url: window.location.href });
    } catch (err) {
      console.error("Share error:", err);
    }
  } else {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  }
};