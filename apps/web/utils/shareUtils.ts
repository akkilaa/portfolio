export const shareOnTwitter = (url: string, title: string) => {
  const encoded = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
  window.open(encoded, '_blank', 'noopener,noreferrer')
}

export const shareOnLinkedIn = (url: string) => {
  const encoded = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  window.open(encoded, '_blank', 'noopener,noreferrer')
}

export const copyLink = async (url: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(url)
    return true
  } catch {
    return false
  }
}
