import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col px-4 py-16 text-foreground">
      <h1 className="mb-8 text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
      
      <div className="flex flex-col gap-8">
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section>
          <h2 className="mb-4 text-2xl font-bold">1. Introduction</h2>
          <p className="leading-7">
            Welcome to Wadebridge Gaming Group (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">2. Information We Collect</h2>
          <p className="leading-7 mb-4">
            We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Social Media Login Data:</strong> We provide you with the option to register with us using your existing social media account details, specifically Discord. If you choose to register in this way, we will collect the information described in the section called &quot;How do we handle your social logins&quot; below.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">3. How We Use Your Information</h2>
          <p className="leading-7 mb-4">
            We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To facilitate account creation and logon process.</li>
            <li>To send administrative information to you.</li>
            <li>To protect our services.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">4. Cookies and Tracking Technologies</h2>
          <p className="leading-7">
            We use cookies solely for authentication and security purposes to allow you to log in and use our services. We do not use third-party cookies for analytics, tracking, or advertising.
          </p>
        </section>
        
        <section className="pt-4 border-t">
            <Link href="/" className="text-primary hover:underline font-medium">
                &larr; Return to Home
            </Link>
        </section>
      </div>
    </main>
  );
}