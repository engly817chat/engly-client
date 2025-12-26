'use client'

import { useQuery } from '@tanstack/react-query'
import { X, Mail, Calendar, Globe, Target, BookOpen, User, Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { authApi } from '@/entities/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/common/avatar'
import { Loader2 } from 'lucide-react'

interface ProfileModalProps {
  onClose: () => void
}

export function ProfileModal({ onClose }: ProfileModalProps) {
  const { t } = useTranslation('common')
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: authApi.getProfile,
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatEnglishLevel = (level: string) => {
    const levels: Record<string, string> = {
      A1: 'A1 - Beginner',
      A2: 'A2 - Elementary',
      B1: 'B1 - Intermediate',
      B2: 'B2 - Upper Intermediate',
      C1: 'C1 - Advanced',
      C2: 'C2 - Proficient',
    }
    return levels[level] || level
  }

  const formatGoal = (goal: string) => {
    const goals: Record<string, string> = {
      IMPROVE_ENGLISH: 'Improve English',
      LEARN_NEW_LANG: 'Learn new language',
      MEET_PEOPLE: 'Meet new people',
    }
    return goals[goal] || goal
  }

  const formatNativeLanguage = (lang: string) => {
    const languages: Record<string, string> = {
      ENGLISH: 'English',
      JAPANESE: 'Japanese',
      HINDI: 'Hindi',
      RUSSIAN: 'Russian',
      SPANISH: 'Spanish',
      PORTUGUESE: 'Portuguese',
      GERMAN: 'German',
      FRENCH: 'French',
      ARABIC: 'Arabic',
      CHINESE: 'Chinese',
      UKRAINIAN: 'Ukrainian',
    }
    return languages[lang] || lang
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm'>
      <div className='relative w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200'>
        <div className='relative overflow-hidden rounded-3xl bg-white shadow-2xl'>
          <button
            onClick={onClose}
            className='absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-lg transition-all hover:bg-white hover:text-gray-900 hover:scale-110'
            aria-label='Close'
          >
            <X size={20} />
          </button>

          {isLoading ? (
            <div className='flex h-96 items-center justify-center'>
              <Loader2 className='h-12 w-12 animate-spin text-blue-500' />
            </div>
          ) : profile ? (
            <>
              {/* Header Section */}
              <div className='relative bg-gradient-to-br from-blue-500 to-indigo-600 px-8 py-12'>
                <div className='flex items-center gap-6'>
                  <Avatar className='h-24 w-24 border-4 border-white shadow-xl'>
                    <AvatarImage src={profile.imgUrl || undefined} alt={profile.username} />
                    <AvatarFallback className='bg-white text-3xl font-bold text-blue-600'>
                      {profile.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex-1 text-white'>
                    <h2 className='text-3xl font-bold'>{profile.username}</h2>
                    <div className='mt-2 flex items-center gap-2 text-blue-100'>
                      <Mail size={16} />
                      <span className='text-sm'>{profile.email}</span>
                    </div>
                    <div className='mt-2 flex items-center gap-2'>
                      <span className='rounded-full bg-white/20 px-3 py-1 text-xs font-medium'>
                        {profile.provider}
                      </span>
                      {profile.emailVerified && (
                        <span className='rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium'>
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className='p-8'>
                <div className='grid gap-6 md:grid-cols-2'>
                  {/* Account Info */}
                  <div className='space-y-4'>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
                      <User size={20} className='text-blue-500' />
                      Account Information
                    </h3>
                    <div className='space-y-3 rounded-xl bg-gray-50 p-4'>
                      <div className='flex items-start gap-3'>
                        <Calendar size={16} className='mt-0.5 text-gray-400' />
                        <div>
                          <p className='text-xs text-gray-500'>Member since</p>
                          <p className='text-sm font-medium text-gray-900'>
                            {formatDate(profile.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-start gap-3'>
                        <Calendar size={16} className='mt-0.5 text-gray-400' />
                        <div>
                          <p className='text-xs text-gray-500'>Last login</p>
                          <p className='text-sm font-medium text-gray-900'>
                            {formatDate(profile.lastLogin)}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-start gap-3'>
                        <Shield size={16} className='mt-0.5 text-gray-400' />
                        <div>
                          <p className='text-xs text-gray-500'>Role</p>
                          <p className='text-sm font-medium text-gray-900'>
                            {profile.roles.replace('ROLE_', '')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Learning Info */}
                  <div className='space-y-4'>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>
                      <BookOpen size={20} className='text-blue-500' />
                      Learning Profile
                    </h3>
                    <div className='space-y-3 rounded-xl bg-gray-50 p-4'>
                      <div className='flex items-start gap-3'>
                        <Globe size={16} className='mt-0.5 text-gray-400' />
                        <div>
                          <p className='text-xs text-gray-500'>Native Language</p>
                          <p className='text-sm font-medium text-gray-900'>
                            {formatNativeLanguage(profile.additionalInfo.nativeLanguage)}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-start gap-3'>
                        <BookOpen size={16} className='mt-0.5 text-gray-400' />
                        <div>
                          <p className='text-xs text-gray-500'>English Level</p>
                          <p className='text-sm font-medium text-gray-900'>
                            {formatEnglishLevel(profile.additionalInfo.englishLevel)}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-start gap-3'>
                        <Target size={16} className='mt-0.5 text-gray-400' />
                        <div>
                          <p className='text-xs text-gray-500'>Goal</p>
                          <p className='text-sm font-medium text-gray-900'>
                            {formatGoal(profile.additionalInfo.goal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Settings Preview */}
                {profile.userSettings && (
                  <div className='mt-6 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4'>
                    <h3 className='mb-3 text-sm font-semibold text-gray-900'>Preferences</h3>
                    <div className='flex flex-wrap gap-2'>
                      <span className='rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm'>
                        Theme: {profile.userSettings.theme}
                      </span>
                      <span className='rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm'>
                        Language: {profile.userSettings.interfaceLanguage}
                      </span>
                      <span className='rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm'>
                        Notifications: {profile.userSettings.notifications ? 'On' : 'Off'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className='flex h-96 items-center justify-center'>
              <p className='text-gray-500'>Failed to load profile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
