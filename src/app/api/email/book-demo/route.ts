import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Create a transporter using your SMTP credentials.
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., "mail.privateemail.com"
      port: Number(process.env.SMTP_PORT), // e.g., 465
      secure: process.env.SMTP_SECURE === 'true', // true for SSL (465)
      auth: {
        user: process.env.SMTP_USER, // your full email address
        pass: process.env.SMTP_PASS, // your email password
      },
    });

    // Email options.
    const mailOptions = {
      from: `"ProspectAI Demo Request" <${process.env.SMTP_USER}>`,
      to: process.env.DEMO_REQUEST_RECIPIENT || 'demo@yourdomain.com', // recipient: consider setting this in your env
      subject: 'New Book Demo Request',
      text: `You have received a new demo request:

First Name: ${body.firstName}
Last Name: ${body.lastName}
Email: ${body.email}
Company Name: ${body.companyName}
Company Website: ${body.companyWebsite}
Company Description: ${body.companyDescription}
Target Customer: ${body.targetCustomer}
Average Contract Value: ${body.averageContractValue}`,
      html: `<h2>New Demo Request</h2>
             <p><strong>First Name:</strong> ${body.firstName}</p>
             <p><strong>Last Name:</strong> ${body.lastName}</p>
             <p><strong>Email:</strong> ${body.email}</p>
             <p><strong>Company Name:</strong> ${body.companyName}</p>
             <p><strong>Company Website:</strong> ${body.companyWebsite}</p>
             <p><strong>Company Description:</strong> ${body.companyDescription}</p>
             <p><strong>Target Customer:</strong> ${body.targetCustomer}</p>
             <p><strong>Average Contract Value:</strong> ${body.averageContractValue}</p>`
    };

    // Send the email.
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ message: 'Demo request sent successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error sending demo request email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send demo request' }), { status: 500 });
  }
} 