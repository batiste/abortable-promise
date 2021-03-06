import { fetch, abortable, Abortable, Abortables } from './abortable'


const abortable1: Abortable<number> = abortable<number>((resolve, reject) => {
  setTimeout(() => resolve(123), 10)
  setTimeout(reject, 20)
})

abortable1.then((v) => {
  if (v === 123) {
    console.log('ok')
  } else {
    throw new Error('Wrong value')
  }
}).catch(() => { throw new Error('Aborted promise expected') })

const abortable2: Abortable<number> = abortable<number>((resolve, reject) => {
  setTimeout(() => resolve(123), 1000)
  setTimeout(reject, 2000)
})

abortable2.then(() => console.log(123)).catch((e) => {
  if(e.message === 'Promise aborted') {
    console.log('ok')
  } else {
    throw new Error('Aborted promise expected')
  }
})
abortable2.abort()


const request: Abortable<Response> = fetch<Response>('http://www.example.com')
request.then(() => console.log('nop')).catch(e => console.log('ok'))
request.abort() // output: ok

async function fetchAsyncAwait() {
  const request: Abortable<Response> = fetch<Response>('http://www.example.com')
  try {
    setTimeout(request.abort, 1)
    await request
    console.log('nop')
  } catch(e) {
    console.log('ok')
  }
}

fetchAsyncAwait() // output: ok


const abortables = new Abortables()

const a = abortable((resolve, reject) => {
  setTimeout(() => resolve(123), 100)
})

a.catch((e) => {
  if(e.message === 'Promise aborted') {
    console.log('ok')
  } else {
    throw new Error('Aborted promise expected')
  }
})

const b = abortable((resolve, reject) => {
  setTimeout(() => resolve(123), 100)
})

abortables.add(a)
abortables.add(b)

abortables.abort()