export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999]">
      <div className="h-1 w-full bg-gray-200">
        <div 
          className="h-full bg-primary animate-loading-bar"
          role="status"
          aria-label="Cargando..."
        />
      </div>
    </div>
  );
} 