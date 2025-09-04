/**
 * OpenRouter API Client for Mistral Small 3.2 24B
 * Cost-effective alternative to OpenAI with excellent performance
 */

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OpenRouterResponse {
  id: string
  choices: Array<{
    message: {
      content: string
      role: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
  model: string
}

export class OpenRouterClient {
  private apiKey: string
  private baseUrl = 'https://openrouter.ai/api/v1'
  private model = 'mistralai/mistral-7b-instruct' // Mistral 7B Instruct - reliable and cost-effective

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async createChatCompletion(
    messages: OpenRouterMessage[],
    options: {
      temperature?: number
      max_tokens?: number
      top_p?: number
      frequency_penalty?: number
      presence_penalty?: number
    } = {}
  ): Promise<OpenRouterResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://contentcraft.ai', // Optional: for tracking
        'X-Title': 'ContentCraft' // Optional: for tracking
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 2000,
        top_p: options.top_p ?? 1,
        frequency_penalty: options.frequency_penalty ?? 0,
        presence_penalty: options.presence_penalty ?? 0,
        stream: false
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
    }

    return response.json()
  }

  async generateContent(
    systemPrompt: string,
    userPrompt: string,
    options?: {
      temperature?: number
      max_tokens?: number
    }
  ): Promise<string> {
    try {
      const response = await this.createChatCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ], options)

      return response.choices[0]?.message?.content || 'No content generated'
    } catch (error) {
      console.error('OpenRouter generation error:', error)
      throw error
    }
  }

  // Get model information and pricing
  static async getModelInfo(): Promise<any> {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models/mistralai/mistral-7b-instruct')
      return response.json()
    } catch (error) {
      console.error('Failed to fetch model info:', error)
      return null
    }
  }

  // Estimate cost for a request
  static estimateCost(inputTokens: number, outputTokens: number): number {
    // Mistral Small 3.2 24B pricing (approximate)
    const inputCostPer1k = 0.0006 // $0.0006 per 1K input tokens
    const outputCostPer1k = 0.0018 // $0.0018 per 1K output tokens
    
    return (inputTokens / 1000) * inputCostPer1k + (outputTokens / 1000) * outputCostPer1k
  }
}

export const createOpenRouterClient = (): OpenRouterClient => {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    console.warn('OPENROUTER_API_KEY environment variable is missing. OpenRouter client will not function properly.')
    // Return a mock client that throws descriptive errors
    return {
      apiKey: '',
      baseUrl: '',
      model: '',
      generateContent: async () => {
        throw new Error('OpenRouter API key is not configured. Please add OPENROUTER_API_KEY to your environment variables.')
      },
      createChatCompletion: async () => {
        throw new Error('OpenRouter API key is not configured. Please add OPENROUTER_API_KEY to your environment variables.')
      }
    } as any
  }
  return new OpenRouterClient(apiKey)
}
