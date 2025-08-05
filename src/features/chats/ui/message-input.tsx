import EmojiPicker from 'emoji-picker-react'
import { Paperclip, Send, Smile } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/ui/common/button'
import { ImagePreview } from './image-preview'

interface MessageInputProps {
  input: string
  imagePreview: string | null
  isUploading: boolean
  showEmojiPicker: boolean
  emojiPickerRef: React.RefObject<HTMLDivElement | null>
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSend: () => void
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  toggleEmojiPicker: () => void
  onEmojiSelect: (emoji: string) => void
  clearImage: () => void
}

export function MessageInput({
  input,
  imagePreview,
  isUploading,
  showEmojiPicker,
  emojiPickerRef,
  fileInputRef,
  onInputChange,
  handleSend,
  handleFileChange,
  toggleEmojiPicker,
  onEmojiSelect,
  clearImage,
}: MessageInputProps) {
  const { t } = useTranslation()

  return (
    <div className='px-4 pb-8 md768:px-6 md:px-12'>
      <div className='relative flex flex-col gap-2'>
        {imagePreview && (
          <ImagePreview
            previewUrl={imagePreview}
            onClear={clearImage}
            isLoading={isUploading}
          />
        )}

        <div className='relative flex-1' ref={emojiPickerRef}>
          <input
            value={input}
            onChange={onInputChange}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className='w-full rounded-[20px] bg-white px-5 py-4 pr-32 placeholder:text-sm placeholder:text-[#0000004D] focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder={t('chatPage.inputPlaceholder')}
          />

          {showEmojiPicker && (
            <div className='absolute bottom-[60px] right-20 z-50'>
              <EmojiPicker onEmojiClick={emoji => onEmojiSelect(emoji.emoji)} />
            </div>
          )}

          <div className='absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2'>
            <button type='button' className='text-gray-500' onClick={toggleEmojiPicker}>
              <Smile size={20} strokeWidth={1.5} />
            </button>

            <input
              type='file'
              accept='image/*'
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              type='button'
              className='text-gray-500'
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={20} strokeWidth={1.5} />
            </button>

            <Button
              onClick={handleSend}
              className='flex items-center gap-2 rounded-[20px] px-3 py-1 md768:px-5 md768:py-2'
            >
              {t('chatPage.send')}
              <Send size={16} strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
