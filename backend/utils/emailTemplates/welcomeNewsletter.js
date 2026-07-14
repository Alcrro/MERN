const welcomeNewsletter = (email, unsubscribeUrl) => `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bine ai venit!</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f8;font-family:'Segoe UI',Arial,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f8;padding:40px 16px;">
    <tr>
      <td align="center">

        <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6d28d9,#4f46e5);padding:40px 40px 32px;text-align:center;">
              <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:rgba(255,255,255,0.65);letter-spacing:3px;text-transform:uppercase;">alcrro.ro</p>
              <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;line-height:1.25;">
                Bine ai venit<br/>în comunitate!
              </h1>
              <p style="margin:14px 0 0;font-size:14px;color:rgba(255,255,255,0.82);line-height:1.65;">
                Tocmai te-ai abonat la ofertele exclusive alcrro.<br/>
                Suntem bucuroși că ești alături de noi.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px 24px;">

              <p style="margin:0 0 18px;font-size:14px;color:#374151;font-weight:700;text-transform:uppercase;letter-spacing:.5px;">Ce primești de acum înainte</p>

              <!-- Row 1 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                <tr>
                  <td style="width:42px;vertical-align:top;padding-top:2px;">
                    <div style="width:36px;height:36px;border-radius:10px;background:#ede9fe;text-align:center;line-height:36px;font-size:17px;font-weight:800;color:#6d28d9;">%</div>
                  </td>
                  <td style="padding-left:14px;vertical-align:top;border-bottom:1px solid #f3f4f6;padding-bottom:12px;">
                    <p style="margin:0;font-size:14px;font-weight:700;color:#111827;">Oferte exclusive</p>
                    <p style="margin:3px 0 0;font-size:13px;color:#6b7280;line-height:1.5;">Reduceri și prețuri speciale disponibile doar abonaților.</p>
                  </td>
                </tr>
              </table>

              <!-- Row 2 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                <tr>
                  <td style="width:42px;vertical-align:top;padding-top:2px;">
                    <div style="width:36px;height:36px;border-radius:10px;background:#ede9fe;text-align:center;line-height:36px;font-size:17px;font-weight:800;color:#6d28d9;">&#9679;</div>
                  </td>
                  <td style="padding-left:14px;vertical-align:top;border-bottom:1px solid #f3f4f6;padding-bottom:12px;">
                    <p style="margin:0;font-size:14px;font-weight:700;color:#111827;">Noutăți și lansări</p>
                    <p style="margin:3px 0 0;font-size:13px;color:#6b7280;line-height:1.5;">Fii primul care află despre produsele noi adăugate în catalog.</p>
                  </td>
                </tr>
              </table>

              <!-- Row 3 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:42px;vertical-align:top;padding-top:2px;">
                    <div style="width:36px;height:36px;border-radius:10px;background:#ede9fe;text-align:center;line-height:36px;font-size:17px;font-weight:800;color:#6d28d9;">!</div>
                  </td>
                  <td style="padding-left:14px;vertical-align:top;">
                    <p style="margin:0;font-size:14px;font-weight:700;color:#111827;">Flash sale-uri</p>
                    <p style="margin:3px 0 0;font-size:13px;color:#6b7280;line-height:1.5;">Alerte în timp real pentru promoțiile cu stoc limitat.</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td align="center">
                    <a href="https://alcrro.ro/products"
                       style="display:inline-block;padding:13px 32px;background:linear-gradient(135deg,#6d28d9,#4f46e5);color:#ffffff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700;">
                      Explorează ofertele &rarr;
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;"><div style="height:1px;background:#f3f4f6;"></div></td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:22px 40px 30px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.8;">
                Ai primit acest email deoarece adresa
                <a href="mailto:${email}" style="color:#6b7280;text-decoration:none;font-weight:600;">${email}</a><br/>
                a fost înregistrată pentru newsletter-ul alcrro.ro.
              </p>
              <p style="margin:10px 0 0;font-size:12px;">
                <a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline;">Dezabonează-te</a>
                &nbsp;·&nbsp;
                <span style="color:#d1d5db;">© ${new Date().getFullYear()} alcrro.ro</span>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

module.exports = { welcomeNewsletter };
