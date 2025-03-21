export function constructSocketMessage(provider: string, data: any) {
  return {
    provider,
    data
  }
}