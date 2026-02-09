import React from 'react';
import html2pdf from 'html2pdf.js';

function ExportPDFButton() {
  const handleExportPDF = () => {
    const mainWrapper = document.getElementById('main-wrapper');
    if (!mainWrapper) {
      alert('Main wrapper not found!');
      return;
    }

    const opt = {
      margin:       0.5,
      filename:     'report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(mainWrapper).set(opt).save();
  };

  return (
    <button onClick={handleExportPDF} className="btn btn-danger">
      Export All Reports as PDF
    </button>
  );
}

export default ExportPDFButton;
