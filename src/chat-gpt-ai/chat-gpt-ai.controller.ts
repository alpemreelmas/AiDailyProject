import { Body, Controller, Post } from '@nestjs/common';
import { ChatGptAiService } from './chat-gpt-ai.service';

@Controller('chat-gpt-ai')
export class ChatGptAiController {
    constructor(private readonly chatGptAiService:ChatGptAiService){}

    @Post("/message")
    getModelAnswer(@Body() question:string){
        return this.chatGptAiService.getModelAnswer(question)
    }
}
