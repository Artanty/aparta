
import { Injectable } from '@angular/core';
import { ThrottleService } from '@services/throttle/throttle.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private ThrottleServ: ThrottleService
  ) { }

  throttle (func: Function, ms: number, skipFirstCall?: boolean) {
    let firstCallSkipped: boolean = false

    const setThrottled = this.ThrottleServ.add
    const clear = this.ThrottleServ.clear
    const isThrottled = this.ThrottleServ.isThrottled
    const that = this.ThrottleServ
    function wrapper (this: any, ...args: any) {
      if (skipFirstCall && !firstCallSkipped) {
        firstCallSkipped = true
        return
      }
      if (isThrottled.call(that, func.name)) {
        console.log(func.name, 'stopped')
        return
      } else {
        func.apply(this, args)
        setThrottled.call(that, func.name, args)
        setTimeout(function() {
          clear.call(that, func.name)
        }, ms as number);
      }
    }
    return wrapper;
  }
  memo (fn: Function) {
    var cache = {} as any
    return function(this: any, ...args: any) {
      let prop = args.join('-')
      if (prop in cache) {
      } else {
        cache[prop] = fn.call(this, prop)
      }
      return cache[prop]
    }
  }
}
