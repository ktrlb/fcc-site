export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By accessing and using this website, you accept and agree to be bound by the terms 
            and provision of this agreement.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Use License</h2>
          <p className="text-gray-700 mb-4">
            Permission is granted to temporarily download one copy of the materials on First Christian Church&apos;s 
            website for personal, non-commercial transitory viewing only.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Disclaimer</h2>
          <p className="text-gray-700 mb-4">
            The materials on First Christian Church&apos;s website are provided on an &apos;as is&apos; basis. 
            First Christian Church makes no warranties, expressed or implied, and hereby disclaims 
            and negates all other warranties.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Limitations</h2>
          <p className="text-gray-700 mb-4">
            In no event shall First Christian Church or its suppliers be liable for any damages 
            (including, without limitation, damages for loss of data or profit, or due to business interruption) 
            arising out of the use or inability to use the materials on the website.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Contact Information</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p className="text-gray-700">
            First Christian Church Granbury<br />
            2101 W US Hwy 377<br />
            Granbury, TX 76048<br />
            Phone: (817) 573-5431
          </p>
        </div>
      </div>
    </div>
  );
}
