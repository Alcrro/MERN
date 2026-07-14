const welcomeNewsletter = (email) => `
<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bine ai venit!</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background:#f4f4f8;font-family:'Segoe UI',Arial,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f8;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header gradient -->
          <tr>
            <td style="background:linear-gradient(135deg,#6d28d9,#4f46e5);padding:40px 40px 32px;text-align:center;">
              <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.7);letter-spacing:2px;text-transform:uppercase;">alcrro.ro</p>
              <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;line-height:1.2;">
                Bine ai venit<br/>în comunitate! 🎉
              </h1>
              <p style="margin:14px 0 0;font-size:15px;color:rgba(255,255,255,0.85);line-height:1.6;">
                Tocmai te-ai abonat la ofertele exclusive alcrro.<br/>
                Suntem bucuroși că ești alături de noi.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">

              <!-- What you get -->
              <p style="margin:0 0 20px;font-size:15px;color:#374151;font-weight:600;">Ce primești de acum înainte:</p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f0f5;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;vertical-align:top;padding-top:2px;">
                          <div style="width:28px;height:28px;border-radius:8px;background:#ede9fe;display:inline-flex;align-items:center;justify-content:center;text-align:center;line-height:28px;font-size:15px;">🏷️</div>
                        </td>
                        <td style="padding-left:12px;vertical-align:top;">
                          <p style="margin:0;font-size:14px;font-weight:700;color:#1f2937;">Oferte exclusive</p>
                          <p style="margin:2px 0 0;font-size:13px;color:#6b7280;line-height:1.5;">Reduceri și prețuri speciale disponibile doar abonaților.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f0f5;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;vertical-align:top;padding-top:2px;">
                          <div style="width:28px;height:28px;border-radius:8px;background:#ede9fe;display:inline-flex;align-items:center;justify-content:center;text-align:center;line-height:28px;font-size:15px;">📱</div>
                        </td>
                        <td style="padding-left:12px;vertical-align:top;">
                          <p style="margin:0;font-size:14px;font-weight:700;color:#1f2937;">Noutăți și lansări</p>
                          <p style="margin:2px 0 0;font-size:13px;color:#6b7280;line-height:1.5;">Fii primul care află despre produsele noi adăugate în catalog.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:36px;vertical-align:top;padding-top:2px;">
                          <div style="width:28px;height:28px;border-radius:8px;background:#ede9fe;display:inline-flex;align-items:center;justify-content:center;text-align:center;line-height:28px;font-size:15px;">⚡</div>
                        </td>
                        <td style="padding-left:12px;vertical-align:top;">
                          <p style="margin:0;font-size:14px;font-weight:700;color:#1f2937;">Flash sale-uri</p>
                          <p style="margin:2px 0 0;font-size:13px;color:#6b7280;line-height:1.5;">Alerte în timp real pentru promoțiile cu stoc limitat.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td align="center">
                    <a href="https://alcrro.ro/products"
                       style="display:inline-block;padding:13px 32px;background:linear-gradient(135deg,#6d28d9,#4f46e5);color:#ffffff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700;letter-spacing:0.2px;">
                      Explorează ofertele →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:#f0f0f5;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.7;">
                Ai primit acest email deoarece adresa <strong style="color:#6b7280;">${email}</strong><br/>
                a fost înregistrată pentru newsletter-ul alcrro.ro.<br/>
                Fără spam — ne respectăm promisiunea.
              </p>
              <p style="margin:12px 0 0;font-size:12px;color:#9ca3af;">
                © ${new Date().getFullYear()} alcrro.ro · Toate drepturile rezervate
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>
`;

module.exports = { welcomeNewsletter };
