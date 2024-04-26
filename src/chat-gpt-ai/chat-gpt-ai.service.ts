import { Injectable } from '@nestjs/common';
import { ClientOptions, OpenAI } from 'openai';

const DEFAULT_MODEL_ID = 'babbage-002';
const DEFAULT_TEMPERATURE = 0.9;

@Injectable()
export class ChatGptAiService {
  private openai: OpenAI;

  constructor() {
    const configuration: ClientOptions = {
      apiKey: process.env.OPENAI_API_KEY ?? 'test',
      organization: process.env.ORGANIZATON_ID,
    };

    this.openai = new OpenAI(configuration);
  }

  async getModelAnswer(question: string, temperature?: number) {
    const params = {
      prompt: question,
      model: DEFAULT_MODEL_ID,
      temperature: temperature != undefined ? temperature : DEFAULT_TEMPERATURE,
    };

    const response = await this.openai.completions.create(params);
    return response;
  }
}
