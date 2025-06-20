export default function ContactPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            Contact Us
          </h1>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="text-gray-600">
                Have questions? We&apos;d love to hear from you...
              </p>
              {/* Contact form will be added here */}
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="text-gray-600">
                Contact details coming soon...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 