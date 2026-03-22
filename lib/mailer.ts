import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendVerificationEmail(email: string, code: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: '【TranslateAI】邮箱验证码',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0f172a;border-radius:12px;color:#e2e8f0">
        <h2 style="margin:0 0 8px;font-size:20px;color:#f8fafc">TranslateAI 邮箱验证</h2>
        <p style="margin:0 0 24px;color:#94a3b8;font-size:14px">请使用以下验证码完成注册，10 分钟内有效。</p>
        <div style="background:#1e293b;border-radius:8px;padding:20px;text-align:center;letter-spacing:12px;font-size:32px;font-weight:700;color:#6366f1">
          ${code}
        </div>
        <p style="margin:24px 0 0;color:#64748b;font-size:12px">如非本人操作，请忽略此邮件。</p>
      </div>
    `,
  })
}
