import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from 'react-helmet';

export default function Privacy() {
  const { t } = useLanguage();
  const sections = [
    {
      title: "Information We Collect",
      content: [
        "Account Information: When you create an account, we collect your name, email address, password, and profile information.",
        "Payment Information: We collect payment details necessary to process lesson bookings, but we do not store your full credit card information.",
        "Lesson Data: We collect information about your lessons, including recordings (with consent), chat messages, and learning progress.",
        "Usage Information: We collect information about how you use our platform, including pages visited, features used, and interaction patterns.",
        "Device Information: We collect information about your device, including IP address, browser type, operating system, and device identifiers.",
      ],
    },
    {
      title: "How We Use Your Information",
      content: [
        "Provide Services: To facilitate language lessons, connect you with teachers, and manage your account.",
        "Improve Platform: To analyze usage patterns, improve our features, and enhance user experience.",
        "Communication: To send you important updates, lesson reminders, and marketing communications (with your consent).",
        "Safety & Security: To protect our platform, prevent fraud, and ensure the safety of our community.",
        "Legal Compliance: To comply with legal obligations and respond to legal requests.",
      ],
    },
    {
      title: "Information Sharing",
      content: [
        "Teachers: We share necessary information with teachers to facilitate lessons, including your name, learning goals, and lesson history.",
        "Service Providers: We share information with trusted third-party providers who help us operate our platform (payment processors, cloud storage, analytics).",
        "Legal Requirements: We may disclose information when required by law or to protect our rights and the safety of our users.",
        "Business Transfers: In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity.",
        "Consent: We may share information with your explicit consent for specific purposes.",
      ],
    },
    {
      title: "Data Security",
      content: [
        "Encryption: We use industry-standard encryption to protect your data in transit and at rest.",
        "Access Controls: We implement strict access controls to ensure only authorized personnel can access your information.",
        "Regular Audits: We conduct regular security audits and assessments to identify and address potential vulnerabilities.",
        "Incident Response: We have procedures in place to respond quickly to any security incidents.",
        "Third-Party Security: We require our service providers to maintain appropriate security measures.",
      ],
    },
    {
      title: "Your Rights and Choices",
      content: [
        "Access: You can access and review your personal information through your account settings.",
        "Correction: You can update or correct your personal information at any time.",
        "Deletion: You can request deletion of your account and associated data, subject to legal retention requirements.",
        "Portability: You can request a copy of your data in a portable format.",
        "Marketing Communications: You can opt out of marketing emails at any time using the unsubscribe link.",
        "Cookies: You can control cookie settings through your browser preferences.",
      ],
    },
    {
      title: "International Data Transfers",
      content: [
        "Global Service: LinguaConnect operates globally, and your information may be transferred to and processed in countries other than your own.",
        "Safeguards: We implement appropriate safeguards, including standard contractual clauses, to protect your information during international transfers.",
        "EU Users: For users in the European Union, we ensure adequate protection for data transfers outside the EU.",
      ],
    },
    {
      title: "Children's Privacy",
      content: [
        "Age Requirements: Our platform is intended for users 13 years of age and older.",
        "Parental Consent: Users under 18 must have parental consent to use our services.",
        "Children's Data: We do not knowingly collect personal information from children under 13 without parental consent.",
        "Special Protections: We implement additional safeguards for users under 18, including enhanced safety measures and parental controls.",
      ],
    },
    {
      title: "Cookies and Tracking",
      content: [
        "Essential Cookies: We use cookies that are necessary for the platform to function properly.",
        "Analytics Cookies: We use cookies to understand how users interact with our platform and improve our services.",
        "Marketing Cookies: With your consent, we use cookies for personalized advertising and marketing.",
        "Third-Party Cookies: Some third-party services we use may place cookies on your device.",
        "Cookie Control: You can manage your cookie preferences through your browser settings or our cookie preference center.",
      ],
    },
  ];

        <Helmet>
            <title>Privacy | Talkcon</title>
            <meta name="description" content="Read our privacy policy and understand how we protect your data." />
        </Helmet>
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Privacy
              <span className="text-primary"> Policy</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Last updated: January 15, 2024
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your privacy is important to us. This Privacy Policy explains how
              LinguaConnect collects, uses, and protects your personal
              information when you use our language learning platform.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <Card className="mb-8 p-6 bg-blue-50 border-blue-200">
                <CardContent className="p-0">
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">
                    Overview
                  </h3>
                  <p className="text-blue-800">
                    LinguaConnect ("we," "our," or "us") is committed to
                    protecting your privacy. This Privacy Policy describes how
                    we collect, use, share, and safeguard your personal
                    information in connection with our online language learning
                    platform and related services.
                  </p>
                </CardContent>
              </Card>

              {sections.map((section, index) => (
                <Card key={index} className="mb-8">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-6 text-primary">
                      {index + 1}. {section.title}
                    </h2>
                    <div className="space-y-4">
                      {section.content.map((paragraph, pIndex) => (
                        <div
                          key={pIndex}
                          className="flex items-start space-x-3"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <p className="text-muted-foreground leading-relaxed">
                            {paragraph}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="mb-8">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-primary">
                    9. Changes to This Privacy Policy
                  </h2>
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      We may update this Privacy Policy from time to time to
                      reflect changes in our practices, technology, legal
                      requirements, or other factors. When we make material
                      changes, we will:
                    </p>
                    <div className="space-y-3">
                      {[
                        "Post the updated Privacy Policy on our website",
                        "Notify you via email if you have an account with us",
                        "Update the 'Last updated' date at the top of this policy",
                        "For significant changes, provide additional notice or seek your consent where required by law",
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <p className="text-muted-foreground leading-relaxed">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6 bg-green-50 border-green-200">
                <CardContent className="p-0">
                  <h3 className="text-xl font-semibold text-green-900 mb-3">
                    Contact Us
                  </h3>
                  <p className="text-green-800 mb-4">
                    If you have any questions, concerns, or requests regarding
                    this Privacy Policy or our privacy practices, please contact
                    us:
                  </p>
                  <div className="space-y-2 text-green-800">
                    <p>
                      <strong>Email:</strong> privacy@linguaconnect.com
                    </p>
                    <p>
                      <strong>Address:</strong> LinguaConnect Privacy Team
                      <br />
                      123 Broadway, Suite 456
                      <br />
                      New York, NY 10001
                    </p>
                    <p>
                      <strong>Phone:</strong> +1 (555) 123-4567
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
