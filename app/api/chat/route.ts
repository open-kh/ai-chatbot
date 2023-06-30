import * as hf from '@/ai/hf'
export async function POST(req: Request) {
  let endpoint = 'facebook'
  return hf.POST(req)
//   switch (endpoint) {
//     case 'openai':
//       return openai.POST(req)
//     case 'facebook':
//       return hf.POST(req)
//     case 'langchain':
//       return lc.POST(req)
//     default:
//   }
}
