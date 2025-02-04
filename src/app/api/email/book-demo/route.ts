import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const emailContent = `You have received a new demo request:

First Name: ${body.firstName}
Last Name: ${body.lastName}
Email: ${body.email}
Company Name: ${body.companyName}
Company Website: ${body.companyWebsite}
Company Description: ${body.companyDescription}
Target Customer: ${body.targetCustomer}
Average Contract Value: ${body.averageContractValue}`;

    const emailHtml = `<h2>New Demo Request</h2>
      <p><strong>First Name:</strong> ${body.firstName}</p>
      <p><strong>Last Name:</strong> ${body.lastName}</p>
      <p><strong>Email:</strong> ${body.email}</p>
      <p><strong>Company Name:</strong> ${body.companyName}</p>
      <p><strong>Company Website:</strong> ${body.companyWebsite}</p>
      <p><strong>Company Description:</strong> ${body.companyDescription}</p>
      <p><strong>Target Customer:</strong> ${body.targetCustomer}</p>
      <p><strong>Average Contract Value:</strong> ${body.averageContractValue}</p>`;

    const { error } = await resend.emails.send({
      from: 'ProspectAI Demo Request <demo@yourdomain.com>',
      to: process.env.DEMO_REQUEST_RECIPIENT || 'demo@yourdomain.com',
      subject: 'New Book Demo Request',
      text: emailContent,
      html: emailHtml,
    });

    if (error) {
      console.error('Error sending email:', error);
      return new Response(JSON.stringify({ error: 'Failed to send demo request' }), { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'Demo request sent successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error sending demo request email:', error);
    return new Response(JSON.stringify({ error: 'Failed to send demo request' }), { status: 500 });
  }
} 