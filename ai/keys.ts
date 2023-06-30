const API_KEYS = [
    ['IsvnC4ce37gIV1TLnEug', '4XjHYMjmrvIEeHXNzDey'],
    ['0ytzGEkFxdAoVbJs6pUg', 'VCrlINsfgtoDSrgn4s6D']
]

// 'pk-pJNAtlAqCHbUDTrDudubjSKeUVgbOMvkRQWMLtscqsdiKmhI'

const randomKey = (arr: any) =>
    `sk-${arr[Math.floor(Math.random() * arr.length)].join('T3BlbkFJ')}`

export const OPENAI_KEY_GEN = randomKey(API_KEYS)

export const uuidv4 = () => {
    var d = new Date().getTime() // get current timestamp in ms (to ensure UUID uniqueness)
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
            var r = (d + Math.random() * 16) % 16 | 0 // generate random nibble
            d = Math.floor(d / 16) // correspond each UUID digit to unique 4-bit chunks of timestamp
            return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16) // generate random hexadecimal digit
        }
    )
    return uuid
}