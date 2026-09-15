import type { NextApiRequest, NextApiResponse } from 'next'
import { isAuthConfigured } from '../../lib/auth-config'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'private, no-store')

  if (!isAuthConfigured()) {
    return res.status(503).json({
      configured: false,
      code: 'AUTH_NOT_CONFIGURED',
      message: 'Wallet login is temporarily unavailable.',
    })
  }

  return res.status(200).json({ configured: true })
}
