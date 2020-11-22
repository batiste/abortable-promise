import AbortController from 'abort-controller'
import fetch from 'node-fetch'

class Abortable<T> implements Promise<T> {
  then<TResult1 = T, TResult2 = never>(onfulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>, onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>): Promise<TResult1 | TResult2> {
    throw new Error("Method not implemented.");
  }
  catch<TResult = never>(onrejected?: (reason: any) => TResult | PromiseLike<TResult>): Promise<T | TResult> {
    throw new Error("Method not implemented.");
  }
  [Symbol.toStringTag]: string;
  abort (reason?: any) {
    throw new Error("Method not implemented.");
  }
}

function abortable<T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
  let r;
  const p = new Promise<T>((resolve, reject) => {
    r = reject
    executor(resolve, reject)
  }) as Abortable<T>
  p.abort = (reason) => {
    r(reason || new Error('Promise cancelled'))
    return p
  }
  return p
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

export { abortableFetch as fetch, abortable }