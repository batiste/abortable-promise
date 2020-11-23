# Abortable Promises library

This library extends the Promise prototype to include an abort
method that allows you to reject a promise programmatically.

It is especially useful with the fetch API in conjunction with
the new AbortController API. 

When you call the abort method on an Abortable the underlying Promise 
is simply rejected and settled. You can use an Abortable in the exact same
way you would use a Promise.

The library is very small and is implemented in TypeScript.

## Install

```bash
npm install pabortable
```

## Usage examples


```typescript
// test.ts
import { fetch, abortable, Abortable } from 'pabortable'

const abortable1: Abortable<number> = abortable<number>((resolve, reject) => {
  setTimeout(() => resolve(123), 10)
  setTimeout(reject, 20)
})

abortable1.then((result) => console.log(result)).catch(console.log) // 123, because no abort occurs


const abortable2: Abortable<number> = abortable<number>((resolve, reject) => {
  setTimeout(() => resolve(123), 1000)
  setTimeout(reject, 2000)
})

abortable2.then(() => console.log(123)).catch(console.log) // Error: Promise aborted
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
```

## Use in a Component based framework

Typical use in a framework such as Angular or React

```typescript
import { fetch, abortable, Abortable, Abortables } from 'pabortable'

class MyComponent {

  abortables = new Abortables<any>()
  request: Abortable<Response>

  onInit() {
    this.abortables.add(
      abortable<number>((resolve, reject) => {
        setTimeout(() => resolve(123), 1000)
      })
    )

    this.fetchData()
  }

  async fetchData() {
    this.request = fetch<Response>('http://api.example.com')
    this.abortables.add(this.request)
    const response = await this.request
    const body = await response.json()
    console.log(body)
  }

  onDestroy() {
    this.abortables.abort()
  }
}
```