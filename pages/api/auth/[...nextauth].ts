import { getAddress, verifyMessage } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { buildWalletLoginMessage } from '../../../lib/wallet-auth'

const authConfigured = Boolean(
  process.env.NEXT_AUTH_SECRET && process.env.JWT_SECRET
)

const authHandler = authConfigured
  ? NextAuth({
      providers: [
        CredentialsProvider({
          name: 'Wallet signature',
          credentials: {
            address: {
              label: 'Address',
              type: 'text',
              placeholder: '0x0',
            },
            message: {
              label: 'Message',
              type: 'text',
            },
            signature: {
              label: 'Signature',
              type: 'text',
            },
            nonce: {
              label: 'Nonce',
              type: 'text',
            },
          },
          async authorize(credentials, req) {
            try {
              const address = getAddress(credentials?.address ?? '')
              const message = credentials?.message ?? ''
              const signature = credentials?.signature ?? ''
              const nonce = credentials?.nonce ?? ''
              const csrfToken =
                typeof req.body?.csrfToken === 'string' ? req.body.csrfToken : ''

              if (!nonce || nonce !== csrfToken || !signature) {
                return null
              }

              const expectedMessage = buildWalletLoginMessage(address, nonce)
              if (message !== expectedMessage) {
                return null
              }

              const recoveredAddress = getAddress(verifyMessage(message, signature))

              if (recoveredAddress !== address) {
                return null
              }

              return { id: address }
            } catch {
              return null
            }
          },
        }),
      ],
      session: {
        strategy: 'jwt',
      },
      jwt: {
        secret: process.env.JWT_SECRET,
      },
      callbacks: {
        async session({ session, token }) {
          session.address = token.sub
          return session
        },
      },
      secret: process.env.NEXT_AUTH_SECRET,
      pages: {
        signIn: '/',
        signOut: '/',
        error: '/',
        newUser: '/',
      },
    })
  : null

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'private, no-store')

  if (!authHandler) {
    return res.status(503).json({
      code: 'AUTH_NOT_CONFIGURED',
      message: 'Wallet login is temporarily unavailable.',
    })
  }

  return authHandler(req, res)
}
