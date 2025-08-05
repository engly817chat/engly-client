export const formatChatTime = (dateString: string, lang: string) => {
  return new Date(dateString).toLocaleTimeString(lang, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: lang === 'en',
  });
}
