import type { AppointmentDto, PrescriptionMedicine } from "@/lib/api/types";

export function generatePrescriptionPdf(appt: AppointmentDto) {
  let medicines: PrescriptionMedicine[] = [];
  if (appt.prescriptionJson) {
    try {
      medicines = JSON.parse(appt.prescriptionJson);
    } catch {
      medicines = [];
    }
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to download or view the Medical Prescription PDF.");
    return;
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Prescription_${appt.patientName.replace(/\s+/g, "_")}_${appt.id}.pdf</title>
  <style>
    @media print {
      body { margin: 0; padding: 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; }
      .no-print { display: none !important; }
    }
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 30px;
      background: #f8fafc;
    }
    .prescription-card {
      max-w: 800px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border: 1px solid #e2e8f0;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0d9488;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 800;
      color: #0d9488;
      margin: 0;
    }
    .brand-subtitle {
      font-size: 12px;
      color: #64748b;
      margin-top: 2px;
    }
    .doctor-meta {
      text-align: right;
    }
    .doctor-name {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }
    .doctor-spec {
      font-size: 13px;
      font-weight: 600;
      color: #0d9488;
      margin-top: 2px;
    }
    .patient-bar {
      background: #f1f5f9;
      padding: 16px 20px;
      border-radius: 8px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      font-size: 13px;
      margin-bottom: 24px;
    }
    .patient-bar div span {
      color: #64748b;
      display: block;
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 600;
    }
    .patient-bar div strong {
      color: #0f172a;
    }
    .rx-symbol {
      font-size: 32px;
      font-weight: 900;
      color: #0d9488;
      margin-bottom: 12px;
      font-style: italic;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #334155;
      margin-bottom: 8px;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
    }
    .diagnosis-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      padding: 12px 16px;
      border-radius: 6px;
      font-size: 14px;
      color: #166534;
      margin-bottom: 24px;
      font-weight: 600;
    }
    table.med-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
      font-size: 13px;
    }
    table.med-table th {
      background: #f8fafc;
      text-align: left;
      padding: 10px 12px;
      border-bottom: 2px solid #e2e8f0;
      color: #475569;
      font-weight: 700;
    }
    table.med-table td {
      padding: 12px;
      border-bottom: 1px solid #f1f5f9;
    }
    table.med-table tr:nth-child(even) {
      background: #fafafa;
    }
    .footer {
      margin-top: 40px;
      pt: 20px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .stamp-box {
      border: 2px dashed #94a3b8;
      padding: 12px 20px;
      border-radius: 8px;
      text-align: center;
      color: #0d9488;
      font-weight: 700;
      font-size: 12px;
    }
    .btn-print {
      background: #0d9488;
      color: #ffffff;
      border: none;
      padding: 10px 24px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div style="text-align: right;" class="no-print">
    <button onclick="window.print()" class="btn-print">🖨️ Print / Save as PDF</button>
  </div>

  <div class="prescription-card">
    <div class="header">
      <div class="brand">
        <div>
          <div class="brand-title">MediSlot</div>
          <div class="brand-subtitle">Smart Digital Healthcare Platform</div>
        </div>
      </div>
      <div class="doctor-meta">
        <div class="doctor-name">Dr. ${appt.doctorName}</div>
        <div class="doctor-spec">${appt.specialization}</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 2px;">MediSlot Verified Practitioner</div>
      </div>
    </div>

    <div class="patient-bar">
      <div>
        <span>Patient Name</span>
        <strong>${appt.patientName}</strong>
      </div>
      <div>
        <span>Age / Gender</span>
        <strong>${appt.patientAge ? `${appt.patientAge} Yrs` : "N/A"} / ${appt.patientGender || "N/A"}</strong>
      </div>
      <div>
        <span>Consultation Date</span>
        <strong>${appt.date}</strong>
      </div>
      <div>
        <span>Rx Reference ID</span>
        <strong>#${appt.id.slice(0, 8)}</strong>
      </div>
      <div>
        <span>Time Slot</span>
        <strong>${appt.startTime} - ${appt.endTime}</strong>
      </div>
      <div>
        <span>Follow-Up Date</span>
        <strong>${appt.followUpDate || "As needed"}</strong>
      </div>
    </div>

    ${appt.diagnosis ? `
      <div class="section-title">Clinical Diagnosis</div>
      <div class="diagnosis-box">
        🩺 ${appt.diagnosis}
      </div>
    ` : ""}

    <div class="rx-symbol">Rx</div>

    ${medicines.length > 0 ? `
      <table class="med-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Medicine Name</th>
            <th>Dosage</th>
            <th>Frequency</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          ${medicines.map((m, idx) => `
            <tr>
              <td><strong>${idx + 1}</strong></td>
              <td><strong style="color: #0f172a;">${m.name}</strong></td>
              <td>${m.dosage}</td>
              <td>${m.frequency}</td>
              <td>${m.duration}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    ` : `
      <p style="font-size: 13px; color: #64748b; italic;">No specific oral medications prescribed.</p>
    `}

    ${appt.labTests ? `
      <div class="section-title" style="margin-top: 20px;">Recommended Diagnostic Tests</div>
      <div style="font-size: 13px; color: #1e293b; background: #fff7ed; border: 1px solid #ffedd5; padding: 12px; border-radius: 6px; margin-bottom: 20px;">
        🧪 <strong>${appt.labTests}</strong>
      </div>
    ` : ""}

    ${appt.notes ? `
      <div class="section-title" style="margin-top: 20px;">Doctor Advice & Instructions</div>
      <div style="font-size: 13px; color: #334155; line-height: 1.6; margin-bottom: 20px;">
        ${appt.notes}
      </div>
    ` : ""}

    <div class="footer">
      <div style="font-size: 11px; color: #94a3b8;">
        Generated electronically via MediSlot Clinic Portal.<br/>
        Valid for official pharmacy fulfillment.
      </div>
      <div class="stamp-box">
        ELECTRONICALLY SIGNED<br/>
        <span style="font-size: 10px; font-weight: 400; color: #64748b;">Dr. ${appt.doctorName}</span>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
