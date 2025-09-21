import Link from "next/link";
import Image from "next/image";
import { Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/images/Basic FCC Logo Assets-White.png"
                alt="First Christian Church Granbury"
                width={1080}
                height={1080}
                className="h-8 w-8 object-contain mx-1"
              />
              <h3 className="text-lg font-semibold">First Christian Church</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>2101 W US Hwy 377<br />Granbury, TX 76048</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(817) 573-5431</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block text-gray-300 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/visit" className="block text-gray-300 hover:text-white transition-colors">
                Visit Us
              </Link>
              <Link href="/calendar" className="block text-gray-300 hover:text-white transition-colors">
                Calendar
              </Link>
              <Link href="/give" className="block text-gray-300 hover:text-white transition-colors">
                Give
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <div className="space-y-2 text-sm">
              <Link href="/resources" className="block text-gray-300 hover:text-white transition-colors">
                Church Library
              </Link>
              <Link href="/resources" className="block text-gray-300 hover:text-white transition-colors">
                Medical Supply Library
              </Link>
              <Link href="https://www.la-reunion.org" className="block text-gray-300 hover:text-white transition-colors">
                La Reunión
              </Link>
              <Link href="/resources" className="block text-gray-300 hover:text-white transition-colors">
                Respite Care
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/FCCGranbury"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@fccgranburytx"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="mailto:office@fccgranbury.org"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <div className="text-sm text-gray-300">
              <p>Sunday Services:</p>
              <p>9:00 AM Modern / 11:00 AM Traditional</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} First Christian Church Granbury. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
