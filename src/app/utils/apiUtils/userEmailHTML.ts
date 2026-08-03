// Auto-reply sent to whoever submitted the contact form.
// Inline styles and a single centred table: that is what mail clients honour.
const htmlString = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Thanks for getting in touch</title>
  </head>
  <body style="margin:0; padding:0; background-color:#000000;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#000000;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background-color:#ffffff; font-family:Helvetica, Arial, sans-serif; color:#000000;">
            <tr>
              <td style="padding:40px 32px 8px 32px;">
                <p style="margin:0; font-size:32px; line-height:1.25; font-weight:bold;">
                  Thanks <span style="color:#f44383;">{{name}}</span> for contacting me. I will <span style="color:#f44383;">reply you ASAP.</span>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 32px 32px;">
                <p style="margin:0; font-size:18px; line-height:1.5;">
                  Your email means a lot to me. I hope we will be able to make the most out of this connection.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px;">
                <div style="height:3px; background-color:#e85042; font-size:0; line-height:0;">&nbsp;</div>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:24px 32px 40px 32px; font-size:16px;">
                <a href="https://www.instagram.com/dja_shay" style="color:#000000; padding:0 8px;">Instagram</a>
                <a href="https://www.linkedin.com/in/akshayguptaujn/" style="color:#000000; padding:0 8px;">LinkedIn</a>
                <a href="https://akshaygupta.live/" style="color:#000000; padding:0 8px;">Website</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

export default htmlString;
