export const renderMessageContent = (content: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const urls = content.match(urlRegex) || []
  const textWithoutUrls = content.replace(urlRegex, '').trim()

  const hasImages = urls.length > 0

  const images = urls.map((url, index) => (
    <img
      key={index}
      src={url}
      alt='Image'
      className='w-full max-w-[200px] rounded-lg'
      onError={(e) => {
        const target = e.target as HTMLImageElement
        const parent = target.parentNode
        if (parent) {
          const link = document.createElement('a')
          link.href = url
          link.textContent = url
          link.target = '_blank'
          parent.replaceChild(link, target)
        }
      }}
    />
  ))

  return (
    <div className={hasImages ? 'w-full max-w-[200px] flex flex-col' : 'max-w-md'}>
      {hasImages && (
        <div className='mb-1'>{images}</div>
      )}

      {textWithoutUrls && (
        <div className='break-words whitespace-pre-wrap'>
          {textWithoutUrls}
        </div>
      )}
    </div>
  )
}
