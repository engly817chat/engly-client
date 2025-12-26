'use client'

import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Mail, Calendar, Globe, Target, BookOpen, User, Shield, ArrowLeft, Bell, Palette, Check, X as XIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { authApi } from '@/entities/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/common/avatar'
import { Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/common/button'
import { AccessGuard } from '@/entities/auth'
import { Input } from '@/shared/ui/common/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/common/select'

export default function ProfilePage() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const [profileChanges, setProfileChanges] = useState<Record<string, any>>({})
  const [settingsChanges, setSettingsChanges] = useState<Record<string, any>>({})

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: authApi.getProfile,
  })

  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data)
      toast.success('Profile updated successfully')
      setProfileChanges({})
    },
    onError: () => {
      toast.error('Failed to update profile')
    },
  })

  const updateSettingsMutation = useMutation({
    mutationFn: authApi.updateSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data)
      toast.success('Settings updated successfully')
      setSettingsChanges({})
    },
    onError: (error: any) => {
      console.error('Settings update error:', error)
      toast.error('Failed to update settings')
    },
  })

  const handleProfileChange = (field: string, value: any) => {
    setProfileChanges({ ...profileChanges, [field]: value })
  }

  const handleSettingsChange = (field: string, value: any) => {
    setSettingsChanges({ ...settingsChanges, [field]: value })
  }

  const handleCancelProfile = () => {
    setProfileChanges({})
  }

  const handleCancelSettings = () => {
    setSettingsChanges({})
  }

  const handleApplyProfile = () => {
    if (Object.keys(profileChanges).length === 0) return
    updateProfileMutation.mutate(profileChanges)
  }

  const handleApplySettings = () => {
    if (Object.keys(settingsChanges).length === 0) return
    updateSettingsMutation.mutate(settingsChanges)
  }

  const hasProfileChanges = Object.keys(profileChanges).length > 0
  const hasSettingsChanges = Object.keys(settingsChanges).length > 0

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
      DEFAULT: 'No specific goal',
      IMPROVE_ENGLISH: 'Improve English',
      LEARN_NEW_LANGUAGE: 'Learn new language',
      MEET_NEW_PEOPLE: 'Meet new people',
    }
    return goals[goal] || goal.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase())
  }

  const formatNativeLanguage = (lang: string) => {
    const languages: Record<string, string> = {
      ENGLISH: 'English',
      SPANISH: 'Spanish',
      FRENCH: 'French',
      GERMAN: 'German',
      CHINESE: 'Chinese',
      JAPANESE: 'Japanese',
      RUSSIAN: 'Russian',
      ARABIC: 'Arabic',
      PORTUGUESE: 'Portuguese',
      HINDI: 'Hindi',
      UKRAINIAN: 'Ukrainian',
      POLISH: 'Polish',
    }
    return languages[lang] || lang.charAt(0) + lang.slice(1).toLowerCase()
  }

  const ENGLISH_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
  const GOALS = ['DEFAULT', 'IMPROVE_ENGLISH', 'LEARN_NEW_LANGUAGE', 'MEET_NEW_PEOPLE']
  const NATIVE_LANGUAGES = [
    'ENGLISH', 'SPANISH', 'FRENCH', 'GERMAN', 'CHINESE', 
    'JAPANESE', 'RUSSIAN', 'ARABIC', 'PORTUGUESE', 'HINDI', 
    'UKRAINIAN', 'POLISH'
  ]
  const THEMES = ['DARK', 'BRIGHT', 'CYAN']
  const INTERFACE_LANGUAGES = ['ENGLISH', 'UKRAINIAN']

  if (isLoading) {
    return (
      <AccessGuard requireAuth>
        <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
          <Loader2 className='h-16 w-16 animate-spin text-blue-500' />
        </div>
      </AccessGuard>
    )
  }

  if (!profile) {
    return (
      <AccessGuard requireAuth>
        <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
          <div className='text-center'>
            <p className='text-xl text-gray-600'>Failed to load profile</p>
            <Button onClick={() => router.back()} className='mt-4'>
              Go Back
            </Button>
          </div>
        </div>
      </AccessGuard>
    )
  }

  return (
    <AccessGuard requireAuth>
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
        {/* Header */}
        <div className='sticky top-0 z-10 border-b bg-white/80 backdrop-blur-lg'>
          <div className='mx-auto flex max-w-6xl items-center justify-between px-6 py-4'>
            <button
              onClick={() => router.back()}
              className='flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900'
            >
              <ArrowLeft size={20} />
              <span className='font-medium'>Back</span>
            </button>
            <h1 className='text-2xl font-bold text-gray-900'>My Profile</h1>
            <div className='w-20'></div>
          </div>
        </div>

        {/* Main Content */}
        <div className='mx-auto max-w-6xl px-6 py-8'>
          {/* Profile Header Card */}
          <div className='overflow-hidden rounded-3xl bg-white shadow-xl'>
            <div className='relative h-48 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700'>
              <div className='absolute inset-0 opacity-10'>
                <div className='h-full w-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,.05)_10px,rgba(255,255,255,.05)_20px)]'></div>
              </div>
            </div>
            
            <div className='relative px-8 pb-8'>
              <div className='flex flex-col items-center sm:flex-row sm:items-end sm:gap-6'>
                <Avatar className='-mt-16 h-32 w-32 border-8 border-white shadow-2xl'>
                  <AvatarImage src={profile.imgUrl || undefined} alt={profile.username} />
                  <AvatarFallback className='bg-gradient-to-br from-blue-500 to-indigo-600 text-5xl font-bold text-white'>
                    {profile.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className='mt-4 flex-1 text-center sm:mt-0 sm:text-left'>
                  <div className='flex items-center justify-center gap-3 sm:justify-start'>
                    <Input
                      value={profileChanges.username ?? profile.username}
                      onChange={(e) => handleProfileChange('username', e.target.value)}
                      className='max-w-md border-2 text-2xl font-bold transition-colors focus:border-blue-500'
                      placeholder='Enter username'
                    />
                  </div>
                  <div className='mt-2 flex flex-wrap items-center justify-center gap-3 sm:justify-start'>
                    <div className='flex items-center gap-2 text-gray-600'>
                      <Mail size={18} />
                      <span>{profile.email}</span>
                    </div>
                    <div className='flex gap-2'>
                      <span className='rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700'>
                        {profile.provider}
                      </span>
                      {profile.emailVerified && (
                        <span className='rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-700'>
                          ✓ Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className='mt-8 grid gap-6 lg:grid-cols-2'>
            {/* Account Information */}
            <div className='overflow-hidden rounded-2xl bg-white shadow-lg'>
              <div className='border-b bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4'>
                <h3 className='flex items-center gap-2 text-xl font-bold text-gray-900'>
                  <User size={24} className='text-blue-600' />
                  Account Information
                </h3>
              </div>
              <div className='p-6'>
                <div className='space-y-6'>
                  <div className='group flex gap-4 rounded-xl bg-gray-50 p-4 transition-all hover:bg-gray-100'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-transform group-hover:scale-110'>
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-500'>Member Since</p>
                      <p className='mt-1 text-lg font-semibold text-gray-900'>
                        {formatDate(profile.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className='group flex gap-4 rounded-xl bg-gray-50 p-4 transition-all hover:bg-gray-100'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-transform group-hover:scale-110'>
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-500'>Last Login</p>
                      <p className='mt-1 text-lg font-semibold text-gray-900'>
                        {formatDate(profile.lastLogin)}
                      </p>
                    </div>
                  </div>

                  <div className='group flex gap-4 rounded-xl bg-gray-50 p-4 transition-all hover:bg-gray-100'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition-transform group-hover:scale-110'>
                      <Shield size={24} />
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-500'>Account Role</p>
                      <p className='mt-1 text-lg font-semibold text-gray-900'>
                        {profile.roles.replace('ROLE_', '')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Profile */}
            <div className='overflow-hidden rounded-2xl bg-white shadow-lg'>
              <div className='border-b bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4'>
                <h3 className='flex items-center gap-2 text-xl font-bold text-gray-900'>
                  <BookOpen size={24} className='text-indigo-600' />
                  Learning Profile
                </h3>
              </div>
              <div className='p-6'>
                <div className='space-y-6'>
                  <div className='group flex gap-4 rounded-xl bg-gray-50 p-4 transition-all hover:bg-gray-100'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition-transform group-hover:scale-110'>
                      <Globe size={24} />
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-gray-500'>Native Language</p>
                      <Select
                        value={profileChanges.nativeLanguage ?? profile.additionalInfo.nativeLanguage}
                        onValueChange={(value) => handleProfileChange('nativeLanguage', value)}
                      >
                        <SelectTrigger className='mt-1 w-full'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {NATIVE_LANGUAGES.map(lang => (
                            <SelectItem key={lang} value={lang}>
                              {formatNativeLanguage(lang)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className='group flex gap-4 rounded-xl bg-gray-50 p-4 transition-all hover:bg-gray-100'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-transform group-hover:scale-110'>
                      <BookOpen size={24} />
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-gray-500'>English Level</p>
                      <Select
                        value={profileChanges.englishLevel ?? profile.additionalInfo.englishLevel}
                        onValueChange={(value) => handleProfileChange('englishLevel', value)}
                      >
                        <SelectTrigger className='mt-1 w-full'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ENGLISH_LEVELS.map(level => (
                            <SelectItem key={level} value={level}>
                              {formatEnglishLevel(level)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className='group flex gap-4 rounded-xl bg-gray-50 p-4 transition-all hover:bg-gray-100'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 transition-transform group-hover:scale-110'>
                      <Target size={24} />
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm font-medium text-gray-500'>Learning Goal</p>
                      <Select
                        value={profileChanges.goal ?? profile.additionalInfo.goal}
                        onValueChange={(value) => handleProfileChange('goal', value)}
                      >
                        <SelectTrigger className='mt-1 w-full'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {GOALS.map(goal => (
                            <SelectItem key={goal} value={goal}>
                              {formatGoal(goal)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {hasProfileChanges && (
                  <div className='mt-6 flex gap-3 border-t pt-6'>
                    <Button
                      onClick={handleApplyProfile}
                      disabled={updateProfileMutation.isPending}
                      className='flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Applying...
                        </>
                      ) : (
                        <>
                          <Check className='mr-2 h-4 w-4' />
                          Apply Changes
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleCancelProfile}
                      variant='outline'
                      className='flex-1'
                    >
                      <XIcon className='mr-2 h-4 w-4' />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Settings & Preferences */}
            {profile.userSettings && (
              <div className='overflow-hidden rounded-2xl bg-white shadow-lg lg:col-span-2'>
                <div className='border-b bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4'>
                  <h3 className='flex items-center gap-2 text-xl font-bold text-gray-900'>
                    <Palette size={24} className='text-purple-600' />
                    Preferences & Settings
                  </h3>
                </div>
                <div className='p-6'>
                  <div className='grid gap-4 sm:grid-cols-3'>
                    <div className='group rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 transition-all hover:shadow-lg'>
                      <div className='flex items-center gap-3'>
                        <Palette className='text-purple-600' size={28} />
                        <div className='flex-1'>
                          <p className='text-sm font-medium text-gray-600'>Theme</p>
                          <Select
                            value={settingsChanges.theme ?? profile.userSettings.theme}
                            onValueChange={(value) => handleSettingsChange('theme', value)}
                          >
                            <SelectTrigger className='mt-1'>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {THEMES.map(theme => (
                                <SelectItem key={theme} value={theme}>
                                  {theme}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className='group rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 transition-all hover:shadow-lg'>
                      <div className='flex items-center gap-3'>
                        <Globe className='text-blue-600' size={28} />
                        <div className='flex-1'>
                          <p className='text-sm font-medium text-gray-600'>Language</p>
                          <Select
                            value={settingsChanges.interfaceLanguage ?? profile.userSettings.interfaceLanguage}
                            onValueChange={(value) => handleSettingsChange('interfaceLanguage', value)}
                          >
                            <SelectTrigger className='mt-1'>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {INTERFACE_LANGUAGES.map(lang => (
                                <SelectItem key={lang} value={lang}>
                                  {lang}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className='group rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 transition-all hover:shadow-lg'>
                      <div className='flex items-center gap-3'>
                        <Bell className='text-green-600' size={28} />
                        <div className='flex-1'>
                          <p className='text-sm font-medium text-gray-600'>Notifications</p>
                          <Select
                            value={(settingsChanges.notifications ?? profile.userSettings.notifications)?.toString()}
                            onValueChange={(value) => handleSettingsChange('notifications', value === 'true')}
                          >
                            <SelectTrigger className='mt-1'>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='true'>Enabled</SelectItem>
                              <SelectItem value='false'>Disabled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {hasSettingsChanges && (
                    <div className='mt-6 flex gap-3 border-t pt-6'>
                      <Button
                        onClick={handleApplySettings}
                        disabled={updateSettingsMutation.isPending}
                        className='flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                      >
                        {updateSettingsMutation.isPending ? (
                          <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Applying...
                          </>
                        ) : (
                          <>
                            <Check className='mr-2 h-4 w-4' />
                            Apply Changes
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleCancelSettings}
                        variant='outline'
                        className='flex-1'
                      >
                        <XIcon className='mr-2 h-4 w-4' />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AccessGuard>
  )
}
