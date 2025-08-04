import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePatientPDF = (patientData) => {
    // Create a temporary div to hold our HTML
    const element = document.createElement('div');
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    document.body.appendChild(element);

    // Generate the HTML content with dynamic patient data
    element.innerHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${patientData.name} - Pre-Chemo Summary</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      
      line-height: 1.6;
    }
    h1, h2 {
      color: #333;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 25px;
    }
    th, td {
      border: 1px solid #aaa;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #F4F4F4;
    }
    .section-title {
      margin-top: 40px;
      font-size: 18px;
      font-weight: bold;
    }
      .container {
        padding: 20px;
      }
  </style>
</head>
<body>
<div class="container">
<h1>Patient Summary: ${patientData.name}</h1>
  <p><strong>Age:</strong> ${patientData.age}<br>
     <strong>Gender:</strong> ${patientData.gender}<br>
     <strong>Visit Type:</strong> Pre-chemo checkup (Cycle 3)</p>
  <p>${patientData.name} is presenting for her pre-chemo checkup prior to her 3rd cycle. She has previously tolerated 2 cycles of chemotherapy (Doxorubicin and Cyclophosphamide). Her primary diagnosis is Breast Cancer.</p>
  <h2 class="section-title">Reported Side Effects</h2>
  <ul>
    <li>Moderate nausea</li>
    <li>Moderate fatigue</li>
    <li>Severe hair loss</li>
  </ul>
  <p><strong>Drugs:</strong> Doxorubicin and Cyclophosphamide</p>
  <p><strong>Alerts:</strong> No critical alerts are recorded at this time, though continuous monitoring is recommended.</p>
  <h2 class="section-title">Blood Counts</h2>
  <table>
    <tr>
      <th>Parameter</th>
      <th>Current</th>
      <th>Status</th>
    </tr>
    <tr>
      <td>Red Blood Cells (RBC)</td>
      <td>4.5 x 10<sup>12</sup>/L</td>
      <td>Stable (4.5 x 10<sup>9</sup>/L to 4.3 x 10<sup>9</sup>/L)</td>
    </tr>
    <tr>
      <td>Platelets (PLT)</td>
      <td>200 x 10<sup>9</sup>/L</td>
      <td>Stable (200 x 10<sup>9</sup>/L to 195 x 10<sup>9</sup>/L)</td>
    </tr>
    <tr>
      <td>White Blood Cells (WBC)</td>
      <td>4.2 x 10<sup>9</sup>/L</td>
      <td>Stable (4.2 x 10<sup>9</sup>/L to 4.1 x 10<sup>9</sup>/L)</td>
    </tr>
  </table>
  <h2 class="section-title">Tumor Reduction</h2>
  <p><strong>Current Size:</strong> 2.5 cm</p>
  <p>Confirmed 28.6% tumor reduction. Healthy blood count recovery:<br>
     WBC nadir after Cycle 1: 3.3 x 10<sup>9</sup>/L → Recovery: 4.2 x 10<sup>9</sup>/L before Cycle 2</p>
  <h2 class="section-title">Vital Value Period Status</h2>
  <table>
    <tr>
      <th>Parameter</th>
      <th>Value</th>
      <th>Period</th>
      <th>Status</th>
    </tr>
    <tr>
      <td>WBC</td>
      <td>4.8 x 10<sup>9</sup>/L</td>
      <td>1 month</td>
      <td>Normal</td>
    </tr>
    <tr>
      <td>ANC</td>
      <td>2.7 x 10<sup>9</sup>/L</td>
      <td>1 month</td>
      <td>Normal</td>
    </tr>
    <tr>
      <td>Hemoglobin</td>
      <td>10.5 g/dL</td>
      <td>1 month</td>
      <td>Normal</td>
    </tr>
    <tr>
      <td>Platelets</td>
      <td>220 x 10<sup>9</sup>/L</td>
      <td>1 month</td>
      <td>Normal</td>
    </tr>
    <tr>
      <td>WBC Nadir (Cycle 1)</td>
      <td>1.8 x 10<sup>9</sup>/L</td>
      <td>3 weeks (post-C1)</td>
      <td>Normal</td>
    </tr>
    <tr>
      <td>ANC Nadir (Cycle 2)</td>
      <td>0.9 x 10<sup>9</sup>/L</td>
      <td>1 week (post-C2)</td>
      <td>Normal</td>
    </tr>
  </table>
  <h2 class="section-title">Vitals</h2>
  <table>
    <tr>
      <th>Vital Sign</th>
      <th>Current</th>
      <th>Status</th>
    </tr>
    <tr>
      <td>Blood Pressure</td>
      <td>120/80 mmHg</td>
      <td>Stable (range: 118/78 – 122/82 mmHg)</td>
    </tr>
    <tr>
      <td>Blood Sugar</td>
      <td>95 mg/dL</td>
      <td>Stable (range: 92 – 98 mg/dL)</td>
    </tr>
    <tr>
      <td>Blood Oxygen (O<sub>2</sub>)</td>
      <td>97%</td>
      <td>Stable (range: 96% – 98%)</td>
    </tr>
    <tr>
      <td>Heart Rate</td>
      <td>72 bpm</td>
      <td>Stable (range: 70 – 74 bpm)</td>
    </tr>
  </table>
  <h2 class="section-title">Summary</h2>
  <ul>
    <li>All vitals normal</li>
    <li>Side effects reported</li>
    <li>Positive progress</li>
    <li>Essential results normal</li>
    <li>Holistic treatment results improving</li>
    <li>Therapy dates reflected in WBC count trend</li>
  </ul>
</div>
  
</body>
</html>
  `;

    // Generate PDF
    return new Promise((resolve) => {
        html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: true,
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            document.body.removeChild(element);
            resolve(pdf);
        });
    });
};