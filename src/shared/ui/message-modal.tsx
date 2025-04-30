interface Props {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
}

export const MessageModal = ({ isOpen, onClose, title, description }: Props) => {
  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
      <div className='w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl'>
        <h2 className='mb-4 text-xl font-semibold'>{title}</h2>
        <p className='mb-4 text-sm text-gray-600'>{description}</p>
        <button
          className='mt-2 rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700'
          onClick={onClose}
        >
          Ok
        </button>
      </div>
    </div>
  )
}
