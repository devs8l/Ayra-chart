export default function ShimmerLoader() {
    return (
      <div className=" bg-white max-w-md overflow-hidden">
        {/* Shimmer loader */}
        <div className="animate-pulse">

          
          {/* Action items - four questions at bottom */}
          <div className="p-4 space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex gap-3">
                <div className="h-5 w-5 bg-gray-200 rounded mt-1"></div>
                <div className="space-y-2 w-full">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }