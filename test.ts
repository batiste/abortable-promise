import { fetch, Abortable } from './abortable'


const abortable1 = new Abortable<number>((resolve, reject) => {
  setTimeout(() => resolve(123), 10)
  setTimeout(reject, 20)
})

abortable1.then((result) => console.log(result)).catch(console.log) // 123, because no abort occurs

const abortable2 = new Abortable((resolve, reject) => {
  setTimeout(() => resolve(123), 1000)
  setTimeout(reject, 2000)
})

abortable2.then(() => console.log(123))
abortable2.catch((error) => {
  if (error.message === 'Promise aborted') {
    console.log('ok')
  } else {
    throw error
  }
}).abort()


const request = fetch<Response>('http://www.example.com')
const p = request.then(() => console.log('nop')).catch(e => console.log('ok'))
console.log(p, p.abort)
p.abort() // output: ok

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