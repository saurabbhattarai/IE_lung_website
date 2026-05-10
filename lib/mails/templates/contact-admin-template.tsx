export const getContactAdminTemplate = ({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) => `
<div style="font-family: Helvetica, Arial, sans-serif; background-color: #f1f5f9; padding: 40px 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 30px; border-left: 6px solid #3D4749;">
    <h1 style="color: #3D4749; font-size: 22px; margin-bottom: 20px; font-weight: bold;">New Website Inquiry</h1>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
      <tr>
        <td style="padding: 10px 0; color: #64748b; font-size: 14px; width: 100px;">Name:</td>
        <td style="padding: 10px 0; color: #1e293b; font-weight: bold;">${name}</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Email:</td>
        <td style="padding: 10px 0; color: #1e293b;">
          <a href="mailto:${email}" style="color: #3D4749; text-decoration: underline;">${email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Source:</td>
        <td style="padding: 10px 0; color: #1e293b;">IE Lung Contact Form</td>
      </tr>
    </table>
    <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
      <p style="margin: 0 0 10px 0; font-weight: bold; color: #3D4749;">Message Details:</p>
      <p style="margin: 0; color: #334155; line-height: 1.6; white-space: pre-line;">${message}</p>
    </div>
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
      <p style="font-size: 13px; color: #94a3b8; margin: 0;">This email was generated automatically from ielung.com.</p>
    </div>
  </div>
</div>`;
