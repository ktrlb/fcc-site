export function GivingInfo() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 font-serif">On Giving</h2>
          <p className="mt-4 text-lg text-gray-600">How your generosity makes a difference</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 border-l-4 border-blue-600">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                <strong>11% of monies received by the congregation are distributed through our outreach 
                partnerships and community.</strong> We have many opportunities for sharing of time and talent.
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                In addition to the generosity of our treasure, our time and talent are also valued. 
                Please see the seasonal guide on our home page to see a variety of ways you can share your gifts.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 font-serif mb-4">
              Thank You for Your Generosity
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Your generosity helps us continue our mission of sharing God&apos;s love with all people. 
              Every gift, no matter the size, makes a meaningful impact in our community.
            </p>
            <a 
              href="https://app.aplos.com/aws/give/fccgranbury/donate"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Donate Online Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
