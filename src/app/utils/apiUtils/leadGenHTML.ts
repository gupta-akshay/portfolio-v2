// Notification sent to me when someone submits the contact form.
const htmlString = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>New contact enquiry</title>
  </head>
  <body style="margin:0; padding:0; background-color:#000000;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#000000;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; background-color:#ffffff; font-family:Helvetica, Arial, sans-serif; color:#000000;">
            <tr>
              <td style="padding:40px 32px 24px 32px;">
                <p style="margin:0; font-size:28px; line-height:1.3; font-weight:bold;">
                  New enquiry submitted on
                  <a href="https://akshaygupta.live/" style="color:#1188e6;">akshaygupta.live</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 40px 32px; font-size:16px; line-height:1.6;">
                <p style="margin:0 0 12px 0;"><strong>Name:</strong> {{name}}</p>
                <p style="margin:0 0 12px 0;"><strong>Email:</strong> {{email}}</p>
                <p style="margin:0 0 12px 0;"><strong>Subject:</strong> {{subject}}</p>
                <p style="margin:0; white-space:pre-wrap;"><strong>Message:</strong><br>{{message}}</p>
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
