export const htmlCode = (email: string, name: string) => {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${email}`;

    return `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:20px 0;font-family:Arial,sans-serif">
    <tr>
      <td align="center">
        
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden">

          <!-- Header -->
          <tr>
            <td style="background:#111;padding:20px;text-align:center">
              <h1 style="color:#fff;margin:0;font-size:22px;">TechMart</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px;text-align:center">
              
              <h2 style="margin-bottom:10px;">Welcome, ${name} 👋</h2>
              
              <p style="color:#555;font-size:14px;line-height:1.6;margin-bottom:25px;">
                Thanks for signing up. Please confirm your email address to activate your account and start shopping.
              </p>

              <!-- Button -->
              <a href="${verifyUrl}" 
                 style="display:inline-block;padding:12px 30px;background:#00d2f4;color:#fff;
                 text-decoration:none;border-radius:30px;font-weight:bold;font-size:14px;">
                 Confirm Email
              </a>

              <p style="margin-top:25px;font-size:12px;color:#888;">
                If you didn’t create this account, you can safely ignore this email.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;padding:20px;text-align:center;font-size:12px;color:#999">
              © ${new Date().getFullYear()} TechMart. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
  `;
};

export const otpCode = (name: string, otp: string) => {
    return `
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:20px 0;font-family:Arial,sans-serif">
    <tr>
      <td align="center">
        
        <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden">

          <!-- Header -->
          <tr>
            <td style="background:#111;padding:20px;text-align:center">
              <h1 style="color:#fff;margin:0;font-size:22px;">TechMart</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px;text-align:center">
              
              <h2 style="margin-bottom:10px;">Password Reset Request 🔑</h2>
              
              <p style="color:#555;font-size:14px;line-height:1.6;margin-bottom:25px;">
                Hi ${name}, you requested to reset your password. Use the code below to complete the process.
              </p>

              <!-- OTP Box -->
              <div style="display:inline-block;padding:20px 40px;background:#f9f9f9;border:1px dashed #00d2f4;color:#111;
                 border-radius:12px;font-weight:bold;font-size:32px;letter-spacing:8px;margin-bottom:25px;">
                 ${otp}
              </div>

              <p style="color:#888;font-size:12px;line-height:1.4;">
                This code is valid for <strong>10 minutes</strong>.<br>
                If you didn’t request this, you can safely ignore this email.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;padding:20px;text-align:center;font-size:12px;color:#999">
              © ${new Date().getFullYear()} TechMart. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
  `;
};