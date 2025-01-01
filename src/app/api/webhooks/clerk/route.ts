import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const SIGNING_SECRET = process.env.SIGNING_SECRET

    if (!SIGNING_SECRET) {
      throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env')
    }

    // Get headers
    const headerPayload = headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error('Missing svix headers')
      return new Response('Error: Missing Svix headers', { status: 400 })
    }

    // Get body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET)

    let evt: WebhookEvent

    try {
      evt = wh.verify(body, {
        'svix-id': svix_id,
        'svix-timestamp': svix_timestamp,
        'svix-signature': svix_signature,
      }) as WebhookEvent
    } catch (err) {
      console.error('Webhook verification failed:', err)
      return new Response('Error: Verification failed', { status: 400 })
    }

    // Handle the webhook event
    const eventType = evt.type
    console.log('Received webhook event:', eventType)

    if (eventType === 'user.created') {
      try {
        const { id, email_addresses, username, first_name } = evt.data
        const primaryEmail = email_addresses[0]?.email_address

        if (!primaryEmail) {
          console.error('No primary email found')
          return new Response('Error: No primary email', { status: 400 })
        }

        // Create user in database with better error handling
        const user = await prisma.user.create({
          data: {
            id: id,
            email: primaryEmail,
            name: username || first_name || 'Anonymous',
          },
        })

        console.log('User created successfully:', user)
        return new Response('User created successfully', { status: 201 })
      } catch (error: unknown) {
        console.error('Database error:', error)
        if (error instanceof Error) {
          return new Response(`Error creating user: ${error.message}`, { status: 500 })
        }
        return new Response('Error creating user', { status: 500 })
      }
    }

    return new Response('Webhook processed', { status: 200 })
  } catch (error: unknown) {
    console.error('Webhook handler error:', error)
    if (error instanceof Error) {
      return new Response(`Internal server error: ${error.message}`, { status: 500 })
    }
    return new Response('Internal server error', { status: 500 })
  }
}