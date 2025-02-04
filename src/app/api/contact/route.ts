import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Create a transporter using your SMTP credentials.
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
    });

    // Setup email options
    const mailOptions = {
      from: '"Your Website Contact" <contact@yourdomain.com>', // Sender address
      to: 'anish@withprospect.com', // Recipient address (your monitored email)
      subject: 'New Contact Form Submission',
      text: `You have received a new message from ${body.name} (${body.email}).
      
Phone: ${body.phone}
Company: ${body.venueName}
Message:
${body.message}`,
      html: `<p>You have received a new message from <strong>${body.name}</strong> (<a href="mailto:${body.email}">${body.email}</a>).</p>
             <p><strong>Phone:</strong> ${body.phone}<br/>
             <strong>Company:</strong> ${body.venueName}</p>
             <p><strong>Message:</strong><br/>${body.message}</p>`
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: 'Email sent successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
  }
} 