import * as openai from "./openai"
import * as hf from "./hf"
import * as lc from "./langchain"


export async function POST(req: Request) {
    let endpoint = 'facebook';
    switch (endpoint) {
        case "openai":
            return openai.POST(req);
        case "facebook":
            return hf.POST(req);
        case "langchain":
            return lc.POST(req);
        default:
            return hf.POST(req);
    }
}
