import type { IEmailService } from '../../src/ports/email.port'

export class InMemoryEmailService implements IEmailService {
  async sendMagicLink(_to: string, _link: string): Promise<void> {}
}
