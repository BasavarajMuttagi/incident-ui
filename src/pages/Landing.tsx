import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/20">
      {/* Navigation */}
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-500 to-blue-600"></div>
          <span className="text-lg font-medium">StatusHub</span>
        </div>

        <div className="hidden items-center space-x-8 md:flex">
          <Link
            to="#features"
            className="text-sm text-gray-400 transition-colors hover:text-white"
          >
            Documentation
          </Link>
          <Link
            to="#resources"
            className="text-sm text-gray-400 transition-colors hover:text-white"
          >
            Resources
          </Link>
          <Link
            to="#preview"
            className="text-sm text-gray-400 transition-colors hover:text-white"
          >
            Request Preview
          </Link>
          <Link
            to="#pricing"
            className="text-sm text-gray-400 transition-colors hover:text-white"
          >
            Pricing
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button className="hidden rounded-full bg-white px-6 text-sm text-black hover:bg-gray-200 md:inline-flex">
              Login
            </Button>
          </Link>
          <Link to={"/signup"}>
            <Button className="rounded-full bg-blue-500 px-6 text-sm text-white hover:bg-blue-600">
              Sign up
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pb-20 pt-32">
        <div className="mx-auto max-w-7xl text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-3xl"></div>
            </div>
            <div className="relative">
              <h1 className="mb-6 bg-gradient-to-b from-neutral-200 to-gray-600 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-7xl">
                The status page you want,
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  effortlessly
                </div>
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400 sm:text-xl">
                Meet the modern standard for status pages. Beautiful out of the
                box, easy to maintain, and built to scale with your team.
              </p>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-500">
                Powering experiences from next-gen startups to enterprises
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link to={"/signup"}>
                  <Button className="h-12 rounded-full bg-blue-500 px-8 text-sm text-white hover:bg-blue-600">
                    Get started
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-white/10 px-8 text-sm text-black hover:bg-white/5 hover:text-white"
                >
                  Get a demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative px-6 py-20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[1000px] w-[1000px] rounded-full bg-blue-500/5 blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Everything you need for service reliability
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              Comprehensive tools and features to manage your service status and
              incidents effectively
            </p>
          </div>

          <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Service Status Management",
                description:
                  "Set and monitor service statuses: Operational, Degraded Performance, Partial Outage, and Major Outage.",
                features: [
                  "Real-time status updates",
                  "Custom status definitions",
                  "Historical status tracking",
                ],
              },
              {
                title: "Incident Management",
                description:
                  "Comprehensive incident lifecycle management from creation to resolution.",
                features: [
                  "Create and update incidents",
                  "Scheduled maintenance",
                  "Incident-service association",
                ],
              },
              {
                title: "Team Collaboration",
                description:
                  "Built for teams with multi-tenant support and granular permissions.",
                features: [
                  "Role-based access control",
                  "Team management",
                  "Activity logging",
                ],
              },
              {
                title: "Public Status Page",
                description:
                  "Beautiful, customizable status pages that keep your users informed.",
                features: [
                  "Real-time updates via WebSocket",
                  "Custom branding",
                  "Incident timeline",
                ],
              },
              {
                title: "Notifications",
                description:
                  "Keep stakeholders informed with automated notifications.",
                features: [
                  "Email notifications",
                  "Webhook integrations",
                  "Custom notification rules",
                ],
              },
              {
                title: "Analytics & Reporting",
                description:
                  "Comprehensive insights into your service reliability.",
                features: [
                  "Uptime metrics",
                  "Incident analytics",
                  "Custom reports",
                ],
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-sm transition-all hover:border-white/[0.16] hover:bg-white/[0.04]"
              >
                <div className="mb-auto">
                  <h3 className="mb-2 text-xl font-semibold group-hover:text-blue-400">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-400">
                    {feature.description}
                  </p>
                </div>
                <ul className="mt-4 space-y-2 pt-4">
                  {feature.features.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-center text-sm text-gray-400"
                    >
                      <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0 text-blue-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="relative px-6 py-16">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-7xl text-center">
          <h3 className="mb-8 text-lg font-medium text-gray-400">
            Trusted by industry leaders
          </h3>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {[
              "https://upload.wikimedia.org/wikipedia/commons/1/1d/Perplexity_AI_logo.svg",
              "https://mistral.ai/images/partners/snowflake.png",
              "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
              "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
              "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
              "https://mistral.ai/images/partners/cloudflare.png",
            ].map((logo, index) => (
              <div key={index}>
                <img
                  src={logo || "/placeholder.svg"}
                  alt="Trusted company"
                  className="h-12 grayscale transition-all hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-24">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to get started?</h2>
          <p className="mb-8 text-gray-400">
            Join thousands of teams using StatusHub to keep their services
            reliable and users happy.
          </p>
          <Button className="h-12 rounded-full bg-blue-500 px-8 text-sm text-white hover:bg-blue-600">
            Start for free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-500 to-blue-600"></div>
            <span className="text-lg font-medium">StatusHub</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400 sm:gap-8">
            <Link to="#" className="transition-colors hover:text-white">
              About
            </Link>
            <Link to="#" className="transition-colors hover:text-white">
              Blog
            </Link>
            <Link to="#" className="transition-colors hover:text-white">
              Careers
            </Link>
            <Link to="#" className="transition-colors hover:text-white">
              Legal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
