import { http } from './http'

type GenerateDescriptionResponse = {
  success: boolean
  description: string
}

export async function generateTaskDescription(title: string) {
  const response = await http.post<GenerateDescriptionResponse>('/ai/generate-description', {
    title,
  })

  return response.data.description
}
