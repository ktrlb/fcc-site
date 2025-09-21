import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, Mail } from "lucide-react";

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 font-serif mb-4">FCC Library</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover books, resources, and materials to support your faith journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Library Information */}
          <Card className="p-6">
            <CardContent className="p-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About Our Library</h2>
              <p className="text-gray-700 mb-6">
                The Library of First Christian Church is located at the heart of the church, 
                through the glass doors off of the Gathering Area. If you have questions about 
                the library, reach out to{" "}
                <a 
                  href="mailto:emily@fccgranbury.org" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  emily@fccgranbury.org
                </a>
                .
              </p>
              <p className="text-gray-700 mb-6">
                We have a digital catalog of books you can view on a computer or smartphone, 
                and the library accepts some donations of books.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">
                    Questions? Contact{" "}
                    <a 
                      href="mailto:emily@fccgranbury.org" 
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      emily@fccgranbury.org
                    </a>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Digital Catalog */}
          <Card className="p-6">
            <CardContent className="p-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Digital Catalog</h2>
              <p className="text-gray-700 mb-6">
                Browse our complete collection of books and resources online. Search by title, 
                author, or topic to find exactly what you&apos;re looking for.
              </p>
              
              <div className="space-y-4">
                <Button asChild size="lg" className="w-full">
                  <a 
                    href="https://www.librarycat.org/lib/FCCGranburyLibrary" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    View Digital Catalog
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
                
                <p className="text-sm text-gray-600 text-center">
                  Opens in a new window
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="mt-12">
          <Card className="p-6">
            <CardContent className="p-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Library Guidelines</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Location & Hours</h3>
                  <p className="text-gray-700">
                    The library is located through the glass doors off of the Gathering Area. 
                    It&apos;s accessible during regular church hours and after services.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Book Donations</h3>
                  <p className="text-gray-700">
                    We love receiving book donations that help grow our collection! We welcome 
                    books on faith, spirituality, Christian living, and other topics that align 
                    with our mission. Please contact Emily to discuss your donation and arrange 
                    a convenient drop-off time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
