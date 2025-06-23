
interface ActivityImageProps {
  imageUrls: string[];
}

const ActivityImage = ({ imageUrls }: ActivityImageProps) => {
  // Ensure imageUrls is always an array and has at least one valid URL
  const validImageUrls = Array.isArray(imageUrls) ? imageUrls.filter(url => url && url.trim() !== '') : [];
  
  return (
    <div className="mb-4">
      {validImageUrls.length > 0 ? (
        <img
          src={validImageUrls[0]}
          alt="Δραστηριότητα"
          className="w-full h-64 object-cover rounded-lg border border-gray-200"
          onError={(e) => {
            console.error('Error loading activity image:', validImageUrls[0]);
            // Hide the image if it fails to load
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-400 text-lg">Χωρίς φωτογραφία</span>
        </div>
      )}
    </div>
  );
};

export default ActivityImage;
