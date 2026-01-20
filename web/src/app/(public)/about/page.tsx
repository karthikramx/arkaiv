import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Users,
  Shield,
  Zap,
  FileText,
  Brain,
  Building2,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Document Management System for MSMEs | Arkaiv - Smart File Organization",
  description:
    "Transform your MSME with Arkaiv's AI-powered document management system. Natural language search, secure file sharing, automated organization, and multi-tenant collaboration for small businesses.",
  keywords: [
    "document management system",
    "MSME document management",
    "small business file organization",
    "AI document search",
    "multi-tenant document sharing",
    "business file storage",
    "document automation",
    "secure file sharing",
    "natural language search",
    "business document vault",
  ],
  openGraph: {
    title: "Arkaiv - Smart Document Management for MSMEs",
    description:
      "AI-powered document management system designed for MSMEs. Search files naturally, organize automatically, share securely.",
    type: "website",
    url: "https://arkaiv.com/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arkaiv - Smart Document Management for MSMEs",
    description:
      "AI-powered document management system designed for MSMEs. Search files naturally, organize automatically, share securely.",
  },
};

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-10 pb-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Smart Document Management for
            <span className="bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
              {" "}
              Growing Businesses
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Arkaiv transforms how MSMEs handle documents with AI-powered search,
            and secure multi-tenant collaboration. Say goodbye to lost files and
            hello to intelligent document management.
          </p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <Link href="/signup">
                Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/demo">Watch Demo</Link>
            </Button>
          </div> */}
        </div>
      </section>

      {/* Problem Statement */}
      <section className="container mx-auto px-6 py-5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            The Document Management Challenge for MSMEs
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Small and medium enterprises spend up to{" "}
            <strong>30% of their time</strong> searching for documents.
            Traditional file systems lead to duplicates, version conflicts, and
            security risks that slow down business growth.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-red-200">
              <CardContent className="pt-6">
                <div className="text-red-500 mb-2">❌</div>
                <h3 className="font-semibold mb-2">Lost Productivity</h3>
                <p className="text-sm text-gray-600">
                  Teams waste hours searching through folders and email
                  attachments
                </p>
              </CardContent>
            </Card>
            <Card className="border-orange-200">
              <CardContent className="pt-6">
                <div className="text-orange-500 mb-2">⚠️</div>
                <h3 className="font-semibold mb-2">Security Risks</h3>
                <p className="text-sm text-gray-600">
                  Shared drives and email expose sensitive business documents
                </p>
              </CardContent>
            </Card>
            <Card className="border-yellow-200">
              <CardContent className="pt-6">
                <div className="text-yellow-500 mb-2">📊</div>
                <h3 className="font-semibold mb-2">Compliance Issues</h3>
                <p className="text-sm text-gray-600">
                  Difficulty tracking document versions and access logs
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Intelligent Features Built for Business Growth
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Arkaiv combines AI intelligence with enterprise-grade security to
              revolutionize how your MSME manages documents.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Search className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>Natural Language Search</CardTitle>
                </div>
                <CardDescription>
                  Find documents instantly with AI-powered search that
                  understands context and intent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Search by description: &ldquo;tax documents from last
                    quarter&rdquo;
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Content-based search within PDFs and images
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Smart suggestions and auto-complete
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Brain className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle>AI-Powered Organization</CardTitle>
                </div>
                <CardDescription>
                  Automatically categorize and organize documents with
                  intelligent folder creation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Auto-create folders based on document types
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Smart file naming and version control
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Duplicate detection and merge suggestions
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle>Multi-Tenant Collaboration</CardTitle>
                </div>
                <CardDescription>
                  Secure document sharing with granular permissions for teams
                  and clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Role-based access control (view, edit, admin)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Secure external sharing with expiration dates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Real-time collaboration and commenting
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <CardTitle>Enterprise-Grade Security</CardTitle>
                </div>
                <CardDescription>
                  Bank-level encryption and compliance features to protect your
                  business data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    AES-256 encryption at rest and in transit
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Audit trails and access logging
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    GDPR and SOX compliance ready
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases for MSMEs */}
      {/* <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Perfect for Every MSME Department
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From HR to Finance, Arkaiv adapts to your business needs and grows
            with your company.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <Building2 className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">HR & Administration</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Employee contracts and onboarding</li>
                <li>• Policy documents and handbooks</li>
                <li>• Performance reviews and training records</li>
                <li>• Compliance certifications</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <FileText className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle className="text-lg">Finance & Accounting</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Invoices and receipts</li>
                <li>• Tax documents and returns</li>
                <li>• Bank statements and reconciliations</li>
                <li>• Vendor contracts and agreements</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <Zap className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle className="text-lg">Operations & Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Project documentation and plans</li>
                <li>• SOPs and process documents</li>
                <li>• Quality certifications (ISO, etc.)</li>
                <li>• Vendor and supplier documents</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section> */}

      {/* Benefits Section */}
      {/* <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Measurable Impact on Your Business
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Join thousands of MSMEs that have transformed their document
              workflows with Arkaiv
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">75%</div>
                <div className="text-gray-600">Faster Document Retrieval</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  50%
                </div>
                <div className="text-gray-600">Reduction in Storage Costs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  90%
                </div>
                <div className="text-gray-600">Improved Compliance</div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center justify-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <blockquote className="text-lg italic text-gray-700 mb-4">
                &ldquo;Arkaiv transformed our document chaos into an organized,
                searchable system. We now find contracts in seconds instead of
                hours. It&apos;s like having a smart assistant for all our
                files.&rdquo;
              </blockquote>
              <cite className="text-sm text-gray-500">
                - Priya Sharma, Founder at TechStart Solutions
              </cite>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Document Management?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of MSMEs using Arkaiv to organize, search, and share
            documents intelligently. Start your free trial today - no credit
            card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <Link href="/signup">
                Start Free 14-Day Trial <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Schedule Demo</Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Free 14-day trial
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section> */}

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Arkaiv",
            applicationCategory: "BusinessApplication",
            description:
              "AI-powered document management system for MSMEs with natural language search, automated organization, and secure multi-tenant collaboration.",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              description: "Free trial available",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              reviewCount: "150",
            },
            featureList: [
              "Natural language search",
              "AI-powered document organization",
              "Multi-tenant collaboration",
              "Enterprise-grade security",
              "Automated folder creation",
              "Document version control",
            ],
          }),
        }}
      />
    </div>
  );
}
