'use client';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <div className="space-y-6 text-black">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">1. Agreement to Terms</h2>
          <p>
            By accessing or using ProspectAI's services, you agree to be bound by these Terms of Service. 
            If you disagree with any part of the terms, you do not have permission to access or use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">2. Description of Service</h2>
          <p>
            ProspectAI provides AI-powered prospecting and lead generation services. We reserve the right 
            to modify, suspend, or discontinue any part of the service at any time without notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">3. User Accounts</h2>
          <p>You are responsible for:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized access</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">4. Payment Terms</h2>
          <p>
            Subscription fees are billed in advance on a monthly or annual basis. All payments are 
            non-refundable except as required by law or as explicitly stated in our refund policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">5. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Use the service for any illegal purpose</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon intellectual property rights</li>
            <li>Attempt to gain unauthorized access to any part of the service</li>
            <li>Interfere with the proper functioning of the service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">6. Intellectual Property</h2>
          <p>
            All content, features, and functionality of our service are owned by ProspectAI and are 
            protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">7. Limitation of Liability</h2>
          <p>
            ProspectAI shall not be liable for any indirect, incidental, special, consequential, or 
            punitive damages resulting from your use of or inability to use the service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify users of any material 
            changes via email or through the service. Continued use of the service after such modifications 
            constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-black">9. Contact Information</h2>
          <p>
            For any questions about these Terms of Service, please contact us at{' '}
            <a href="mailto:anish@withprospect.com" className="text-indigo-600 hover:text-indigo-500">
              anish@withprospect.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
} 