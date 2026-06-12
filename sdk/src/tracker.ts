import { models } from "./constants.js";
import { getRandomNumber } from "./helpers.js";
import type { LLM, modelResponse, TrackingPayload } from "./types.js";

class Tracker{

    llm;

    constructor(llm:LLM){
        this.llm = llm;
    }

    sendPrompt(data:any)
    {
        /// Call top LLM;
        const a = getRandomNumber(10,1000);
        const b = getRandomNumber(20,800);
        const response:modelResponse = {
            modelName:models[getRandomNumber(0,models.length-1)]||"",
            usage:{
                prompt_tokens:a,
                completion_tokens:b,
                total_tokens:a+b
            }
        }
        return response;
    }

    proxy(data:any){
        const response = this.sendPrompt(data);
        this.sendTrackRequest(response)
    }

    sendTrackRequest(modelResponse:modelResponse){
        const payload:TrackingPayload = {
            modelName:modelResponse.modelName,
            input_tokens:modelResponse.usage.prompt_tokens,
            output_tokens:modelResponse.usage.completion_tokens
        } 
        // TODO
        // send payload to requestHandlerService;     
    }
}