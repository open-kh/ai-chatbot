import * as openai from "./openai"
import * as hf from "./hf"
import * as lc from "./langchain"

const API_KEYS = [
    ["IsvnC4ce37gIV1TLnEug", "4XjHYMjmrvIEeHXNzDey"],
    ["0ytzGEkFxdAoVbJs6pUg", "VCrlINsfgtoDSrgn4s6D"],
];

// 'pk-pJNAtlAqCHbUDTrDudubjSKeUVgbOMvkRQWMLtscqsdiKmhI'

const randomKey = (arr: any) => `sk-${arr[Math.floor(Math.random() * arr.length)].join('T3BlbkFJ')}`;

export const OPENAI_KEY = randomKey(API_KEYS);

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
