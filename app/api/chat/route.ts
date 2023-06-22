import * as openai from "./openai"
import * as hf from "./hf"

export async function POST(req: Request) {
    console.log(req.body);
    return hf.POST(req);
    
    // return req.body!.endpoint=='hr'? hf.POST(req) : openai.POST(req);
}
