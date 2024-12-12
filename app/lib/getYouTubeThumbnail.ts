//app/lib/getYouTubeThumbnail.ts

export const getThumbnailFromEmbedUrl = (
  embedUrl: string,
  quality: "default" | "hqdefault" | "maxresdefault" = "hqdefault",
) => {
  if (!embedUrl.includes("/embed/")) {
    console.warn("Invalid YouTube embed URL:", embedUrl);
    return null;
  }
  const videoId = embedUrl.split("/embed/")[1]; // 'abcdefghijk' 추출
  return videoId
    ? `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
    : null;
};
