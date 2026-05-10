export const getBookingUserTemplate = ({
  patientName,
  preferredDate,
  preferredTime,
  reason,
}: {
  patientName: string;
  preferredDate: string;
  preferredTime: string;
  reason: string;
}) => `
<div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; border: 1px solid #e2e8f0;">
    <div style="border-bottom: 2px solid #3D4749; padding-bottom: 20px; margin-bottom: 30px;">
      <h1 style="color: #3D4749; font-size: 24px; margin: 0;">IE Lung & Sleep Institute</h1>
    </div>
    <h2 style="color: #3D4749; font-size: 20px;">Appointment Request Received</h2>
    <p style="color: #475569; line-height: 1.7;">Hi <strong>${patientName}</strong>,</p>
    <p style="color: #475569; line-height: 1.7;">Thank you for requesting an appointment. Our patient coordinator will review your request and contact you shortly to finalize the details.</p>
    <div style="background-color: #f1f5f9; padding: 25px; border-radius: 12px; margin-top: 24px;">
      <h3 style="margin: 0 0 15px 0; font-size: 14px; color: #3D4749; text-transform: uppercase;">Requested Schedule:</h3>
      <p style="margin: 5px 0; color: #475569;"><strong>Service:</strong> ${reason}</p>
      <p style="margin: 5px 0; color: #475569;"><strong>Date:</strong> ${preferredDate}</p>
      <p style="margin: 5px 0; color: #475569;"><strong>Time Slot:</strong> ${preferredTime}</p>
    </div>
    <p style="margin-top: 40px; color: #475569; font-size: 15px;">Best Regards,<br /><strong>IE Lung Support Team</strong></p>
  </div>
</div>`;
