import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Input validation schema
interface ContactFormData {
  name: string
  email: string
  subject: string
  category: string
  message: string
}

function validateInput(data: unknown): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  const d = data as Record<string, unknown>
  
  if (!d.name || typeof d.name !== 'string' || d.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long')
  }
  
  if (!d.email || typeof d.email !== 'string' || !emailRegex.test(d.email)) {
    errors.push('Please provide a valid email address')
  }
  
  if (!d.subject || typeof d.subject !== 'string' || d.subject.trim().length < 5) {
    errors.push('Subject must be at least 5 characters long')
  }
  
  if (!d.category) {
    errors.push('Please select a category')
  }
  
  if (!d.message || typeof d.message !== 'string' || d.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long')
  }
  
  // Length limits
  if (d.name && typeof d.name === 'string' && d.name.length > 100) {
    errors.push('Name must be less than 100 characters')
  }
  
  if (d.subject && typeof d.subject === 'string' && d.subject.length > 200) {
    errors.push('Subject must be less than 200 characters')
  }
  
  if (d.message && typeof d.message === 'string' && d.message.length > 5000) {
    errors.push('Message must be less than 5000 characters')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: ContactFormData
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validate input
    const validation = validateInput(body)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    const { name, email, subject, category, message } = body

    // Create transporter for Zoho SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_HOST,
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.ZOHO_SMTP_USER,
        pass: process.env.ZOHO_SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      }
    })

    // Verify transporter configuration
    try {
      await transporter.verify()
    } catch (error) {
      console.error('SMTP configuration error:', error)
      return NextResponse.json(
        { error: 'Email service configuration error' },
        { status: 500 }
      )
    }

    // Email content for admin notification
    const adminEmailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission - ContentCraft</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; }
        .field { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #555; margin-bottom: 5px; display: block; }
        .value { color: #333; word-wrap: break-word; }
        .category { display: inline-block; background: #3b82f6; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #666; }
        .message-box { background: #f8f9fa; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">ContentCraft Support</p>
        </div>
        
        <div class="content">
            <div class="field">
                <span class="label">Name:</span>
                <span class="value">${name}</span>
            </div>
            
            <div class="field">
                <span class="label">Email:</span>
                <span class="value">${email}</span>
            </div>
            
            <div class="field">
                <span class="label">Category:</span>
                <span class="category">${category}</span>
            </div>
            
            <div class="field">
                <span class="label">Subject:</span>
                <span class="value">${subject}</span>
            </div>
            
            <div class="field">
                <span class="label">Message:</span>
                <div class="message-box">
                    ${message.replace(/\n/g, '<br>')}
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>This message was sent from the ContentCraft contact form.<br>
            Please respond directly to: <strong>${email}</strong></p>
            <p style="margin-top: 15px; font-size: 12px; opacity: 0.7;">
                Submission time: ${new Date().toLocaleString('en-US', { 
                  timeZone: 'UTC', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
            </p>
        </div>
    </div>
</body>
</html>
    `.trim()

    // Auto-reply email content for user
    const userReplyContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank you for contacting ContentCraft</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 30px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #666; }
        .cta-button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Thank You for Contacting Us!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">We've received your message</p>
        </div>
        
        <div class="content">
            <p>Hi ${name},</p>
            
            <p>Thank you for reaching out to ContentCraft! We've received your message regarding "<strong>${subject}</strong>" and appreciate you taking the time to contact us.</p>
            
            <p><strong>What happens next?</strong></p>
            <ul>
                <li>Our support team will review your message within 24 hours</li>
                <li>You'll receive a detailed response from our team</li>
                <li>For urgent issues, we'll prioritize your request</li>
            </ul>
            
            <p>In the meantime, you might find these resources helpful:</p>
            
            <a href="https://contentcraft.com/help" class="cta-button" style="color: white;">Visit Help Center</a>
            
            <p style="margin-top: 30px;">If you need immediate assistance, you can browse our <a href="https://contentcraft.com/help">FAQ section</a> or reach out to our community for help.</p>
            
            <p>Thanks for being part of the ContentCraft community!</p>
            
            <p>Best regards,<br>
            <strong>The ContentCraft Team</strong></p>
        </div>
        
        <div class="footer">
            <p><strong>ContentCraft</strong> - AI-Powered Content Transformation</p>
            <p style="margin-top: 10px; font-size: 12px;">
                This is an automated response. Please do not reply to this email.<br>
                For support, visit <a href="https://contentcraft.com/contact">contentcraft.com/contact</a>
            </p>
        </div>
    </div>
</body>
</html>
    `.trim()

    // Send admin notification email
    try {
      await transporter.sendMail({
        from: `"ContentCraft Contact Form" <${process.env.ZOHO_SMTP_USER}>`,
        to: process.env.ZOHO_SMTP_USER, // Send to your admin email
        subject: `[ContentCraft] New ${category} inquiry: ${subject}`,
        html: adminEmailContent,
        replyTo: email, // Allow direct reply to user
      })
    } catch (error) {
      console.error('Failed to send admin notification:', error)
      return NextResponse.json(
        { error: 'Failed to send admin notification' },
        { status: 500 }
      )
    }

    // Send auto-reply to user
    try {
      await transporter.sendMail({
        from: `"ContentCraft Support" <${process.env.ZOHO_SMTP_USER}>`,
        to: email,
        subject: 'Thank you for contacting ContentCraft - We\'ll be in touch soon!',
        html: userReplyContent,
      })
    } catch (error) {
      console.error('Failed to send user auto-reply:', error)
      // Don't fail the request if auto-reply fails
    }

    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Your message has been sent successfully! We\'ll get back to you within 24 hours.' 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
