export type OnIntersect = (entry: IntersectionObserverEntry) => void

export interface IObserverOptions {
  root?: Element | null
  rootMargin?: string
  threshold: number | number[]
}

/*
  Library to handle intersection observer functionalities.
  https://codesandbox.io/s/0xq11z660v
*/
export class IObserver {
  private options: IObserverOptions = {
    threshold: 0,
  }
  private _elementMap = new Map()
  private obsvr: any = {}

  // when set to true, callback will be execute only once for a target
  private observeOnce = false

  // Initialize options
  public constructor({ options, observeOnce = false }: { options: IObserverOptions; observeOnce?: boolean }) {
    this.options = options
    this.observeOnce = observeOnce
    this._elementMap = new Map()
    this.obsvr = new IntersectionObserver(this.callBack, this.options)
  }

  // Intersection observer callback method
  private callBack = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return
      this._elementMap.get(entry.target)(entry)
      this.observeOnce && this.unobserve(entry.target)
    })
  }

  // Consumer calls this public method to observe an element
  public observe = (target: Element, onIntersect: OnIntersect) => {
    if (!target) return
    this._elementMap.set(target, onIntersect)
    this.obsvr.observe(target)
  }

  // Consumer calls this public method to unobserve an element
  public unobserve = (target: Element) => {
    if (!target) return
    this.obsvr.unobserve(target)
    this._elementMap.delete(target)
  }
}

export default IObserver
