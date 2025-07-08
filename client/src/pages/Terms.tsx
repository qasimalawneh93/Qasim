import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from 'react-helmet';

export default function Terms() {
  const { t } = useLanguage();
  const sections = [
    {
      title: "Acceptance of Terms",
      content: [
        "By accessing or using LinguaConnect, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
        "If you do not agree with any part of these terms, you may not use our services.",
        "These terms apply to all users, including students, teachers, and visitors to our platform.",
        "Your use of LinguaConnect constitutes acceptance of these terms and our Privacy Policy.",
      ],
    },
    {
      title: "Description of Service",
      content: [
        "LinguaConnect is an online platform that connects language learners with qualified teachers for one-on-one lessons.",
        "We provide video conferencing tools, scheduling systems, payment processing, and educational resources.",
        "We do not directly provide language instruction; we facilitate connections between independent teachers and students.",
        "The quality and content of lessons are the responsibility of individual teachers.",
      ],
    },
    {
      title: "User Accounts",
      content: [
        "You must create an account to use our services and provide accurate, complete information.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "You must be at least 13 years old to create an account. Users under 18 require parental consent.",
        "One person may not maintain multiple accounts without our prior written consent.",
        "You are responsible for all activities that occur under your account.",
      ],
    },
    {
      title: "User Conduct",
      content: [
        "You agree to use LinguaConnect respectfully and in accordance with all applicable laws.",
        "Harassment, discrimination, or inappropriate behavior toward other users is strictly prohibited.",
        "You may not use our platform for any illegal or unauthorized purpose.",
        "Sharing of inappropriate content, including but not limited to explicit material, is forbidden.",
        "You may not attempt to disrupt or interfere with the platform's operation or security.",
      ],
    },
    {
      title: "Teacher Responsibilities",
      content: [
        "Teachers must provide accurate information about their qualifications and experience.",
        "Teachers are responsible for the quality and content of their lessons.",
        "Teachers must maintain professional conduct during all interactions with students.",
        "Teachers must comply with all applicable laws and regulations in their jurisdiction.",
        "Teachers are independent contractors and not employees of LinguaConnect.",
      ],
    },
    {
      title: "Student Responsibilities",
      content: [
        "Students must attend scheduled lessons or provide appropriate notice for cancellations.",
        "Students are responsible for having the necessary technology and internet connection for lessons.",
        "Students must treat teachers with respect and maintain appropriate conduct during lessons.",
        "Students are responsible for their own learning progress and outcomes.",
        "Students must comply with teachers' lesson policies and requirements.",
      ],
    },
    {
      title: "Payment Terms",
      content: [
        "All payments must be made through our secure payment system.",
        "Lesson fees are set by individual teachers and paid in advance of lessons.",
        "We charge a service fee for facilitating connections and providing platform services.",
        "Refunds are subject to our refund policy and individual teacher policies.",
        "You are responsible for any applicable taxes on your use of our services.",
      ],
    },
    {
      title: "Cancellation and Refund Policy",
      content: [
        "Lessons may be cancelled or rescheduled according to individual teacher policies.",
        "Generally, lessons cancelled with at least 4 hours notice may be rescheduled without penalty.",
        "Refunds for cancelled lessons are subject to teacher policies and our refund guidelines.",
        "We reserve the right to cancel lessons in cases of platform technical issues or policy violations.",
        "Unused lesson credits may expire according to the terms specified at the time of purchase.",
      ],
    },
    {
      title: "Intellectual Property",
      content: [
        "LinguaConnect and its content are protected by copyright, trademark, and other intellectual property laws.",
        "You may not reproduce, distribute, or create derivative works from our platform content without permission.",
        "Teachers retain rights to their original teaching materials but grant us license to use them on our platform.",
        "User-generated content remains owned by users but is licensed to us for platform operation.",
        "You may not use our trademarks or branding without our prior written consent.",
      ],
    },
    {
      title: "Privacy and Data Protection",
      content: [
        "Your privacy is important to us. Please review our Privacy Policy for details on how we collect and use your information.",
        "We implement security measures to protect your personal information.",
        "Lesson recordings may be stored for quality assurance and dispute resolution purposes.",
        "You consent to the processing of your data as described in our Privacy Policy.",
        "You may request access to, correction of, or deletion of your personal data subject to legal requirements.",
      ],
    },
    {
      title: "Platform Availability",
      content: [
        "We strive to maintain platform availability but cannot guarantee uninterrupted service.",
        "We may perform maintenance, updates, or modifications that temporarily affect service availability.",
        "We are not liable for any losses resulting from platform downtime or technical issues.",
        "We reserve the right to modify or discontinue services with appropriate notice.",
        "You are responsible for having backup communication methods for urgent situations.",
      ],
    },
    {
      title: "Limitation of Liability",
      content: [
        "LinguaConnect's liability is limited to the maximum extent permitted by law.",
        "We are not liable for the quality, safety, or legality of lessons provided by teachers.",
        "We are not responsible for disputes between teachers and students.",
        "Our total liability to you for any claims shall not exceed the amount you paid us in the preceding 12 months.",
        "We are not liable for indirect, incidental, or consequential damages.",
      ],
    },
  ];

        <Helmet>
            <title>Terms | Talkcon</title>
            <meta name="description" content="Review the terms and conditions of using Talkcon." />
        </Helmet>
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Terms of
              <span className="text-primary"> Service</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Last updated: January 15, 2024
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These Terms of Service govern your use of LinguaConnect's language
              learning platform and services. Please read them carefully before
              using our services.
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
                    Important Notice
                  </h3>
                  <p className="text-blue-800">
                    These Terms of Service ("Terms") constitute a legally
                    binding agreement between you and LinguaConnect. By using
                    our platform, you acknowledge that you have read,
                    understood, and agree to be bound by these Terms.
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
                    13. Termination
                  </h2>
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Either party may terminate this agreement at any time:
                    </p>
                    <div className="space-y-3">
                      {[
                        "You may close your account at any time through your account settings",
                        "We may suspend or terminate your account for violations of these Terms",
                        "We may terminate or modify our services with 30 days' notice",
                        "Upon termination, your access to the platform will cease",
                        "Certain provisions of these Terms will survive termination",
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

              <Card className="mb-8">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-primary">
                    14. Changes to Terms
                  </h2>
                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      We reserve the right to modify these Terms at any time. We
                      will notify users of significant changes through:
                    </p>
                    <div className="space-y-3">
                      {[
                        "Email notification to registered users",
                        "Prominent notice on our platform",
                        "Updated 'Last modified' date on this page",
                        "For material changes, we may require explicit acceptance",
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

              <Card className="mb-8">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6 text-primary">
                    15. Governing Law and Disputes
                  </h2>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {[
                        "These Terms are governed by the laws of New York, United States",
                        "Any disputes will be resolved through binding arbitration in New York",
                        "You waive the right to participate in class action lawsuits",
                        "Some jurisdictions may not allow certain limitations, in which case they may not apply to you",
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
                    Contact Information
                  </h3>
                  <p className="text-green-800 mb-4">
                    If you have questions about these Terms of Service, please
                    contact us:
                  </p>
                  <div className="space-y-2 text-green-800">
                    <p>
                      <strong>Email:</strong> legal@linguaconnect.com
                    </p>
                    <p>
                      <strong>Address:</strong> LinguaConnect Legal Team
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
