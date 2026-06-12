
export type LLM = {
    name:string;
}
export type TrackingPayload = {
    modelName:string;
    input_tokens:number;
    output_tokens:number;
}

export type modelResponse = {
    modelName:string;
    usage:{
        prompt_tokens: number,
        completion_tokens: number,
        total_tokens: number
    }
}