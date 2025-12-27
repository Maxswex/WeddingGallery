import React, { useEffect, useState, useCallback } from 'react';
import { X, Heart, Camera, Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const coupleNames = 'Armin & Margherita';
  const weddingDate = '31 Maggio 2025';
  const [loading, setLoading] = useState(false);
  const [photoAspects, setPhotoAspects] = useState({});

  // ✅ URL AGGIORNATO della tua Web App (con ordinamento corretto cartelle)
  const DRIVE_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbzdMq4a7gmR2gCtZjkWeJdj_em3GZRz20r--IVtXbd1h9vmC2H9nxC1sFCdtzsJPWzsMQ/exec';

  // ✅ URL per visualizzare le immagini da Google Drive (formato download diretto)
  const driveImgUrl = (fileId) => `https://lh3.googleusercontent.com/d/${fileId}`;

  const loadFromDrive = useCallback(async () => {
    setLoading(true);
    
    try {
      const res = await fetch(DRIVE_WEBAPP_URL);
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const mapped = (data.photos || []).map((p) => ({
        id: p.id,
        url: driveImgUrl(p.id),
        name: p.name,
        folder: p.folder,
        timestamp: p.createdAt,
      }));

      setPhotos(mapped);
    } catch (err) {
      console.error('Errore caricamento Drive:', err);
    } finally {
      setLoading(false);
    }
  }, [DRIVE_WEBAPP_URL]);

  useEffect(() => {
    loadFromDrive();
  }, [loadFromDrive]);

  const handleImageLoad = (photoId, event) => {
    const img = event.target;
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    setPhotoAspects(prev => ({
      ...prev,
      [photoId]: aspectRatio
    }));
  };

  const getRowSpan = (photoId) => {
    const aspect = photoAspects[photoId];
    if (!aspect) return 'auto';
    
    // Calcola quante righe dovrebbe occupare in base all'aspect ratio
    if (aspect > 1.5) return 'span 2'; // molto orizzontale
    if (aspect > 1) return 'span 2'; // orizzontale
    if (aspect > 0.75) return 'span 3'; // quadrata
    if (aspect > 0.6) return 'span 4'; // verticale
    return 'span 5'; // molto verticale
  };

  // Raggruppa le foto per cartella
  const photosByFolder = photos.reduce((acc, photo) => {
    if (!acc[photo.folder]) {
      acc[photo.folder] = [];
    }
    acc[photo.folder].push(photo);
    return acc;
  }, {});

  const folderNames = Object.keys(photosByFolder).sort();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8E7' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
        
        .font-script {
          font-family: 'Dancing Script', cursive;
        }
        
        .font-serif-elegant {
          font-family: 'Playfair Display', serif;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in;
        }
      `}</style>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20 z-0">
        <div className="absolute top-10 left-10 text-rose-300">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>
        <div className="absolute top-40 right-20 text-pink-300">
          <Heart className="w-6 h-6 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="absolute bottom-40 left-20 text-amber-300">
          <Sparkles className="w-6 h-6 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-20 right-40 text-rose-300">
          <Heart className="w-8 h-8 animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>

      {/* Header */}
      <div className="relative bg-white/80 backdrop-blur-sm shadow-lg border-b border-rose-100 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-0 items-center">
            {/* Foto a sinistra */}
            <div className="relative h-[600px] overflow-hidden">
              <img 
                src="/hero-photo.jpg" 
                alt="Armin e Margherita" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Testo a destra */}
            <div className="px-8 md:px-16 py-12 text-center md:text-left flex flex-col justify-center">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-script text-gray-800 mb-6 tracking-wide font-bold leading-tight">
                {coupleNames}
              </h1>

              {weddingDate && (
                <p className="text-gray-600 text-2xl md:text-3xl font-serif-elegant italic mb-8">
                  {weddingDate}
                </p>
              )}

              <div className="h-1 w-32 bg-gradient-to-r from-rose-400 to-pink-500 mb-8 mx-auto md:mx-0"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Gallery */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {loading ? (
          <div className="text-center py-20">
            <RefreshCw className="w-20 h-20 mx-auto text-rose-300 mb-6 animate-spin" />
            <p className="text-gray-500 text-xl font-serif-elegant italic">
              Caricamento foto in corso...
            </p>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20">
            <Camera className="w-20 h-20 mx-auto text-rose-300 mb-6" />
            <p className="text-gray-500 text-xl font-serif-elegant italic">
              Le foto verranno caricate a breve...
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {folderNames.map((folderName) => (
              <div key={folderName} className="space-y-6">
                {/* Titolo della sezione */}
                <div className="text-center">
                  <h2 className="text-4xl font-serif-elegant italic text-gray-800 font-semibold inline-block relative">
                    {folderName}
                    <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-300 to-transparent"></div>
                  </h2>
                </div>

                {/* Griglia con row span dinamici */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 auto-rows-[80px]">
                  {photosByFolder[folderName].map((photo) => (
                    <div
                      key={photo.id}
                      className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
                      style={{ gridRow: getRowSpan(photo.id) }}
                      onClick={() => setSelectedPhoto(photo)}
                      title={photo.name}
                    >
                      <img 
                        src={photo.url} 
                        alt={photo.name || 'Foto matrimonio'} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onLoad={(e) => handleImageLoad(photo.id, e)}
                      />

                      {/* Overlay estetico */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full transition-all"
            title="Chiudi"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
            {selectedPhoto.folder && (
              <div className="text-white/80 text-lg font-serif-elegant italic">
                {selectedPhoto.folder}
              </div>
            )}
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={selectedPhoto.url}
                alt="Foto matrimonio ingrandita"
                className="max-w-full max-h-full w-auto h-auto object-contain"
                style={{ maxHeight: 'calc(100vh - 120px)', maxWidth: 'calc(100vw - 80px)' }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
