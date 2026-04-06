import { createClient } from "@/supabase/server";

export const dynamic = 'force-dynamic';

export default async function DebugImagesPage() {
  const supabase = await createClient();
  
  const { data: tours, error } = await supabase
    .from('tours')
    .select('id, title, slug, hero_image_url, gallery_images')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error cargando datos</h1>
        <pre className="bg-red-50 p-4 rounded">{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Debug: Imágenes de Tours</h1>
      
      <div className="space-y-6">
        {tours?.map((tour) => (
          <div key={tour.id} className="border rounded-lg p-4 bg-white shadow">
            <h2 className="text-xl font-semibold mb-2">{tour.title}</h2>
            <p className="text-sm text-gray-600 mb-4">Slug: {tour.slug}</p>
            
            <div className="space-y-4">
              {/* Hero Image */}
              <div>
                <h3 className="font-medium mb-2">Hero Image URL:</h3>
                {tour.hero_image_url ? (
                  <div className="space-y-2">
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded break-all">
                      {tour.hero_image_url}
                    </p>
                    <div className="border rounded overflow-hidden w-full max-w-md">
                      <img 
                        src={tour.hero_image_url} 
                        alt={tour.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const errorDiv = document.createElement('div');
                          errorDiv.className = 'bg-red-100 text-red-700 p-4 text-sm';
                          errorDiv.textContent = `❌ Error al cargar imagen: ${tour.hero_image_url}`;
                          target.parentElement?.appendChild(errorDiv);
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-red-600 font-medium">❌ NULL - No hay imagen hero</p>
                )}
              </div>

              {/* Gallery Images */}
              <div>
                <h3 className="font-medium mb-2">Gallery Images:</h3>
                {tour.gallery_images && Array.isArray(tour.gallery_images) && tour.gallery_images.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{tour.gallery_images.length} imágenes</p>
                    <div className="space-y-2">
                      {tour.gallery_images.map((url: string, index: number) => (
                        <div key={index} className="space-y-1">
                          <p className="text-xs font-mono bg-gray-100 p-1 rounded break-all">
                            {index + 1}. {url}
                          </p>
                          <div className="border rounded overflow-hidden w-32 h-32">
                            <img 
                              src={url} 
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = 'none';
                                const errorDiv = document.createElement('div');
                                errorDiv.className = 'bg-red-100 text-red-700 p-2 text-xs';
                                errorDiv.textContent = '❌ Error';
                                target.parentElement?.appendChild(errorDiv);
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">📁 Sin imágenes en galería</p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <a 
                href={`/tours/${tour.slug}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                🔗 Ver tour público →
              </a>
            </div>
          </div>
        ))}
      </div>

      {tours?.length === 0 && (
        <p className="text-gray-500 text-center py-8">No hay tours en la base de datos</p>
      )}
    </div>
  );
}
