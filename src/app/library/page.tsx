import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, Mail } from "lucide-react";

export default function LibraryPage() {
  return (
    <div className="min-h-screen pt-24" style={{ backgroundColor: 'rgb(68 64 60)' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <BookOpen className="h-12 w-12" style={{ color: 'rgb(220 38 38)' }} />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white font-serif mb-6">FCC Library</h1>
          <p className="text-2xl text-white max-w-3xl mx-auto">
            Discover books, resources, and materials to support your faith journey
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Library Information */}
          <Card className="p-8 !bg-red-600 border-0 shadow-none" style={{ backgroundColor: 'rgb(220 38 38)' }}>
            <CardContent className="p-0">
              <div className="flex items-center mb-6">
                <BookOpen className="h-8 w-8 text-white mr-3" />
                <h2 className="text-2xl font-bold text-white">About Our Library</h2>
              </div>
              <p className="text-white mb-6">
                The Library of First Christian Church is located at the heart of the church, 
                through the glass doors off of the Gathering Area. If you have questions about 
                the library, reach out to{" "}
                <a 
                  href="mailto:emily@fccgranbury.org" 
                  className="text-white hover:text-white/80 underline font-semibold"
                >
                  emily@fccgranbury.org
                </a>
                .
              </p>
              <p className="text-white mb-6">
                We have a digital catalog of books you can view on a computer or smartphone, 
                and the library accepts some donations of books.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-white" />
                  <span className="text-white">
                    Questions? Contact{" "}
                    <a 
                      href="mailto:emily@fccgranbury.org" 
                      className="text-white hover:text-white/80 underline font-semibold"
                    >
                      emily@fccgranbury.org
                    </a>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Digital Catalog */}
          <Card className="p-8 !bg-teal-800 border-0 shadow-none" style={{ backgroundColor: 'rgb(17 94 89)' }}>
            <CardContent className="p-0">
              <div className="flex items-center mb-6">
                <BookOpen className="h-8 w-8 text-white mr-3" />
                <h2 className="text-2xl font-bold text-white">Digital Catalog</h2>
              </div>
              <p className="text-white mb-6">
                Browse our complete collection of books and resources online. Search by title, 
                author, or topic to find exactly what you&apos;re looking for.
              </p>
              
              <div className="space-y-4">
                <Button asChild size="lg" className="w-full bg-white text-teal-800 hover:bg-white/10 hover:text-white border border-white transition-colors">
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
                
                <p className="text-base text-white text-center">
                  Opens in a new window
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-8 !bg-indigo-900 border-0 shadow-none" style={{ backgroundColor: 'rgb(49 46 129)' }}>
            <CardContent className="p-0">
              <h2 className="text-2xl font-bold text-white mb-6">Location & Hours</h2>
              <p className="text-white">
                The library is located through the glass doors off of the Gathering Area. 
                It&apos;s accessible during regular church hours and after services.
              </p>
            </CardContent>
          </Card>
          
          <Card className="p-8 !bg-amber-500 border-0 shadow-none" style={{ backgroundColor: 'rgb(245 158 11)' }}>
            <CardContent className="p-0">
              <h2 className="text-2xl font-bold text-white mb-6">Book Donations</h2>
              <p className="text-white">
                We love receiving book donations that help grow our collection! We welcome 
                books on faith, spirituality, Christian living, and other topics that align 
                with our mission. Please contact Emily to discuss your donation and arrange 
                a convenient drop-off time.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
