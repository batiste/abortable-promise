import AbortController from 'abort-controller'
import fetch from 'node-fetch'

type TExecutor<T> =  (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void

class AbortedPromise extends Error {}

class Abortable<T> implements Promise<T> {
  resolve
  reject
  promise: Promise<T>
  catches = []
  resolves = []

  _res(value) {
    this.resolves.forEach(ftc => ftc(value))
    this.resolve(value)
  }

  _rej(reason) {
    this.catches.forEach(ftc => ftc(reason))
    this.reject(reason)
  }

  constructor(executor: TExecutor<T>) {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      try {
        executor((v) => this._res(v), (r) => this._rej(r))
      } catch (e) {
        this._rej(e)
      }
    })
  }
  [Symbol.toStringTag]: string;

  then<TResult1 = T, TResult2 = never>(onfulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>, onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>): Abortable<TResult1 | TResult2> {
    return new Abortable<T>((resolve, reject) => {
      this.resolves.push(resolve)
    }) as any
  }

  catch<TResult = never>(onrejected?: (reason: any) => TResult | PromiseLike<TResult>): Abortable<T | TResult> {
    return new Abortable<T>((resolve, reject) => {
      this.catches.push(reject)
    })
  }

  abort (reason?: any): Abortable<T> {
    this._rej(reason || new AbortedPromise('Promise aborted'))
    return this
  }
}

function abortableFetch<T>(input: RequestInfo, init?: RequestInit) {
  const controller = new AbortController()
  const signal = controller.signal
  const p = fetch(input, { signal, ...init })
  const abortable = p as unknown as Abortable<T>
  abortable.abort = () => {  
    controller.abort()
    return p
  }
  return abortable
}

export { abortableFetch as fetch, Abortable, AbortedPromise }