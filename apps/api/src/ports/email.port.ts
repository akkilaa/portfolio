export interface IEmailService {
  sendMagicLink(to: string, link: string): Promise<void>
}
