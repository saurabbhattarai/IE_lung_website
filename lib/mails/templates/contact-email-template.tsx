export const getContactUserTemplate = ({
  name,
  message,
}: {
  name: string;
  message: string;
}) => `
<div style="font-family: Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    <div style="border-bottom: 2px solid #3D4749; padding-bottom: 20px; marginBottom: 30px;">
      <h1 style="color: #3D4749; font-size: 24px; margin: 0; font-weight: bold;">IE Lung & Sleep Institute</h1>
    </div>
    <h2 style="color: #3D4749; font-size: 20px; margin-bottom: 20px; margin-top: 20px;">Message Received</h2>
    <p style="color: #475569; line-height: 1.7; margin-bottom: 20px;">Hi <strong>${name}</strong>,</p>
    <p style="color: #475569; line-height: 1.7; margin-bottom: 20px;">Thank you for reaching out to us. We have successfully received your inquiry through our website. Our specialized team will get back to you within 24–48 business hours.</p>
    <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin-top: 24px;">
      <p style="margin-bottom: 10px; font-weight: bold; color: #3D4749; font-size: 14px; text-transform: uppercase;">Copy of your message:</p>
      <p style="color: #475569; line-height: 1.6; font-style: italic; white-space: pre-line; margin: 0;">"${message}"</p>
    </div>
    <p style="margin-top: 40px; color: #475569; line-height: 1.7; font-size: 15px;">Best Regards,<br /><strong>IE Lung Support Team</strong></p>
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
    <p style="font-size: 12px; color: #94a3b8; text-align: center;">12047 4th Street, Yucaipa, CA 92399 | +1 (840) 258-0972</p>
  </div>
</div>`;
