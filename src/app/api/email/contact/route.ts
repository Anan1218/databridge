import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const emailContent = `
      You have received a new message from ${body.name} (${body.email}).

      Phone: ${body.phone}
      Company: ${body.venueName}
      Message:
      ${body.message}
    `;

    const emailHtml = `
      <p>You have received a new message from <strong>${body.name}</strong> (<a href="mailto:${body.email}">${body.email}</a>).</p>
      <p><strong>Phone:</strong> ${body.phone}<br/>
      <strong>Company:</strong> ${body.venueName}</p>
      <p><strong>Message:</strong><br/>${body.message}</p>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Your Website Contact <contact@yourdomain.com>',
      to: process.env.CONTACT_FORM_RECIPIENT || 'your@email.com',
      subject: 'New Contact Form Submission',
      text: emailContent,
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending email:', error);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
    }

    console.log('Email sent successfully:', data);
    return new Response(JSON.stringify({ message: 'Email sent successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
  }
}