import { ContactForm } from '@/components/contact/contact-form';

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-stone-700 pt-32 pb-16 lg:pt-40 lg:pb-24" style={{ backgroundColor: 'rgb(68 64 60)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
              Contact Us
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              We'd love to hear from you! Whether you have questions about visiting, 
              want to learn more about our ministries, or need pastoral care, 
              we're here to help.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-stone-50 py-16">
        <div className="container mx-auto px-4">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">
                Get In Touch
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
                  <p className="text-gray-700">
                    2109 W. Hwy 377<br />
                    Granbury, TX 76048
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                  <p className="text-gray-700">
                    (817) 573-5431
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Worship Times</h3>
                  <p className="text-gray-700">
                    Sundays: 9:00 AM & 11:00 AM
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Office Hours</h3>
                  <p className="text-gray-700">
                    Monday - Thursday: 9:00 AM - 5:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-lg text-white" style={{ backgroundColor: 'rgb(220 38 38)' }}>
              <h3 className="text-xl font-bold text-white mb-4">
                What to Expect
              </h3>
              <ul className="space-y-3 text-white">
                <li className="flex items-start">
                  <span className="text-white mr-2">•</span>
                  We typically respond within 24-48 hours
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-2">•</span>
                  For urgent pastoral care needs, please call directly
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-2">•</span>
                  Your privacy is important to us - we won't share your information
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-2">•</span>
                  You'll receive a confirmation email after submitting
                </li>
              </ul>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
