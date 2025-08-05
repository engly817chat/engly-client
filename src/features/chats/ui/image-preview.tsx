import { Loader2, X } from "lucide-react"

export function ImagePreview({
  previewUrl,
  onClear,
  isLoading,
}: {
  previewUrl: string;
  onClear: () => void;
  isLoading: boolean;
}) {
  return (
    <div className='absolute bottom-20 left-0 z-50 max-h-[90px] max-w-[90px] overflow-hidden rounded-md shadow-lg'>
      <img src={previewUrl} alt='preview' className='h-full w-full object-cover' />
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <Loader2 className='h-5 w-5 animate-spin text-gray-600' />
        </div>
      )}
      <button
        onClick={onClear}
        className='absolute right-1 top-1 rounded-full bg-white bg-opacity-80 p-0.5 hover:bg-opacity-100'
      >
        <X size={12} />
      </button>
    </div>
  )
}
