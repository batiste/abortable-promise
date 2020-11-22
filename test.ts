import { fetch, abortable } from './abortable'


const abortable1 = abortable<number>((resovle, reject) => {
  setTimeout(() => resovle(123), 10)
  setTimeout(reject, 20)
})

abortable1.then((result) => console.log(result)).catch(console.log) // 123, because no abort occurs

const abortable2 = abortable<number>((resovle, reject) => {
  setTimeout(() => resovle(123), 1000)
  setTimeout(reject, 2000)
})

abortable2.then(() => console.log(123)).catch(console.log) // Error: Promise cancelled
abortable2.abort()


const request = fetch<Response>('http://www.example.com')
request.then(() => console.log('nop')).catch(e => console.log('ok'))
request.abort() // output: ok

async function fetchAsyncAwait() {
  const request = fetch<Response>('http://www.example.com')
  try {
    setTimeout(request.abort, 1)
    await request
    console.log('nop')
  } catch(e) {
    console.log('ok')
  }
}

fetchAsyncAwait() // output: ok