import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Image as ImageIcon, Video, Music, File } from "lucide-react";
import { getFeaturedAssets } from "@/lib/asset-queries";
import Image from "next/image";

function getFileIcon(type: string) {
  switch (type) {
    case 'image':
      return ImageIcon;
    case 'video':
      return Video;
    case 'audio':
    case 'music':
      return Music;
    case 'document':
    case 'pdf':
      return FileText;
    default:
      return File;
  }
}

function formatFileSize(size: string | null) {
  if (!size) return '';
  const bytes = parseInt(size);
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function FeaturedAssets() {
  const featuredAssets = await getFeaturedAssets();

  if (featuredAssets.length === 0) {
    return null;
  }

  // Debug: Log asset URLs in production
  if (process.env.NODE_ENV === 'production') {
    console.log('Featured assets URLs:', featuredAssets.map(a => ({ name: a.name, url: a.fileUrl, type: a.type })));
  }

  return (
    <section className="py-16 !bg-stone-700" style={{ backgroundColor: 'rgb(68 64 60)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 font-serif">
            Featured Resources
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Download our latest resources, documents, and media to support your faith journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredAssets.map((asset, index) => {
            const IconComponent = getFileIcon(asset.type);
            const isImage = asset.type === 'image' && asset.mimeType?.startsWith('image/');
            
            // Cycle through signature colors
            const colors = [
              { bg: 'red-600', text: 'text-red-600', hex: '#dc2626' },
              { bg: 'teal-800', text: 'text-teal-800', hex: '#115e59' },
              { bg: 'indigo-900', text: 'text-indigo-900', hex: '#312e81' }
            ];
            const colorScheme = colors[index % colors.length];
            
            return (
              <Card key={asset.id} className="hover:shadow-lg transition-shadow border-0 shadow-none" style={{ backgroundColor: colorScheme.hex }}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {isImage ? (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                          <img
                            src={asset.fileUrl}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Image failed to load:', asset.fileUrl);
                              // Fallback to icon if image fails
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                          <IconComponent className="h-8 w-8" style={{ color: colorScheme.hex }} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                        {asset.name}
                      </h3>
                      
                      {asset.description && (
                        <p className="text-white text-sm mb-3 line-clamp-2">
                          {asset.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-white/80 mb-4">
                        <span className="capitalize">{asset.type}</span>
                        {asset.fileSize && (
                          <span>{formatFileSize(asset.fileSize)}</span>
                        )}
                      </div>
                      
                      <Button 
                        asChild
                        size="sm" 
                        className={`w-full bg-white border border-white hover:bg-white/10 hover:text-white transition-colors ${colorScheme.text}`}
                      >
                        <a 
                          href={asset.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
