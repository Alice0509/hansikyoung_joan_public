// app/lib/getYouTubeThumbnail.ts

export const getThumbnailFromEmbedUrl = (
  embedUrl: string,
  quality: 'default' | 'hqdefault' | 'maxresdefault' = 'hqdefault',
): string | null => {
  try {
    const url = new URL(embedUrl);
    let videoId: string | null = null;

    if (url.hostname.includes('youtube.com')) {
      if (url.pathname.startsWith('/embed/')) {
        videoId = url.pathname.split('/embed/')[1];
      } else if (url.pathname === '/watch') {
        videoId = url.searchParams.get('v');
      }
    } else if (url.hostname.includes('youtu.be')) {
      videoId = url.pathname.slice(1);
    }

    if (videoId) {
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
      return thumbnailUrl;
    }
    console.warn('Unable to extract video ID from URL:', embedUrl);
    return null;
  } catch (error) {
    console.error('Invalid YouTube embed URL:', embedUrl);
    return null;
  }
};
