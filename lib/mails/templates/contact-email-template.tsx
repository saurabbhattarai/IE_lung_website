export const getContactUserTemplate = ({
  name,
  message,
}: {
  name: string;
  message: string;
}) => {
  const brandAccent = "#2eb09c";
  const brandPrimary = "#333d3f";
  const baseUrl = "https://ielung.com";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    .container { font-family: 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 10px; }
    .card { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
    .header { background-color: #ffffff; padding: 30px; text-align: center; border-bottom: 4px solid ${brandAccent}; }
    .content { padding: 40px 30px; color: #374151; line-height: 1.6; }
    .badge { background-color: #ecfdf5; color: ${brandAccent}; padding: 6px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; }
    .details-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin: 25px 0; }
    .footer { background-color: #f3f4f6; padding: 30px; text-align: center; font-size: 12px; color: #6b7280; }
    .btn { display: inline-block; background-color: ${brandPrimary}; color: #ffffff !important; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <img src="${baseUrl}/logo.png" alt="IE Lung & Sleep Institute" width="100" style="margin-bottom: 15px;">
        <div style="color: ${brandPrimary}; font-size: 20px; font-weight: bold;">Message Received</div>
      </div>
      
      <div class="content">
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for reaching out to <strong>IE Lung & Sleep Institute</strong>. We have successfully received your inquiry through our website. Our team will review your message and get back to you within 24–48 business hours.</p>
        
        <div class="details-box">
          <span class="badge">Your Inquiry Reference</span>
          <p style="margin: 15px 0 0 0; color: #475569; font-style: italic; font-size: 14px; line-height: 1.6;">
            "${message}"
          </p>
        </div>

        <p style="font-size: 14px; color: #6b7280;">If this is a medical emergency, please do not wait for a reply. Call 911 or proceed to the nearest emergency room immediately.</p>
        
        <a href="https://maps.google.com/?q=12047+4th+St+Yucaipa+CA" class="btn">View Our Location</a>
      </div>

      <div class="footer">
        <p style="margin-bottom: 10px;"><strong>IE Lung & Sleep Institute</strong><br>
        12047 4th Street, Yucaipa, CA 92399</p>
        <p>Phone: +1 (840) 258-0972 | Email: support@ielung.com</p>
        <hr style="border: none; border-top: 1px solid #d1d5db; margin: 20px 0;">
        <p style="font-style: italic;">CONFIDENTIALITY NOTICE: This email and any files transmitted with it are confidential and intended solely for the use of the individual or entity to whom they are addressed.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;
};
