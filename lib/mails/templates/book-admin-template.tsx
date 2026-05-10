export const getBookingAdminTemplate = ({
  patientName,
  phone,
  reason,
  preferredDate,
  preferredTime,
  email,
}: {
  patientName: string;
  phone: string;
  reason: string;
  preferredDate: string;
  preferredTime: string;
  email: string;
}) => `
<div style="font-family: Arial, sans-serif; background-color: #f1f5f9; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 40px; border-top: 4px solid #3D4749;">
    <h2 style="color: #3D4749; margin-top: 0;">New Appointment Booking</h2>
    <p style="color: #64748b;">A new appointment request has been submitted via the website.</p>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Patient Name:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${patientName}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Phone Number:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold;">
          <a href="tel:${phone}" style="color: #3D4749;">${phone}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Email Address:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold;">
          <a href="mailto:${email}" style="color: #3D4749;">${email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Requested Service:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${reason}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Preferred Date:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${preferredDate}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #64748b;">Time Slot:</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">${preferredTime}</td>
      </tr>
    </table>
    <div style="margin-top: 30px; text-align: center;">
      <p style="font-size: 12px; color: #94a3b8;">This inquiry was sent from the IE Lung & Sleep Institute Appointment Form.</p>
    </div>
  </div>
</div>`;
