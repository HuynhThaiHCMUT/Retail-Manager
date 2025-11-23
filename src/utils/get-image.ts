export function getImageUrl(name: string) {
  const baseUrl = process.env.EXPO_PUBLIC_SERVER_HOST
  return `${baseUrl}/pictures/${name}`
}
