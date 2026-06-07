import nodemailer from 'nodemailer'
import type { IEmailService } from '@api/ports/email.port'

export class NodemailerEmailService implements IEmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? 'localhost',
    port: Number(process.env.SMTP_PORT ?? 1025),
    secure: process.env.SMTP_SECURE === 'true',
    ignoreTLS: process.env.SMTP_IGNORE_TLS === 'true',
  })

  async sendMagicLink(to: string, link: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM ?? 'noreply@portfolio.local',
      to,
      subject: 'Your login link',
      text: `Click the link below to log in:\n\n${link}\n\nThis link expires in 15 minutes.`,
      html: `<p>Click the link below to log in:</p><p><a href="${link}">${link}</a></p><p>This link expires in 15 minutes.</p>`,
    })
  }
}
