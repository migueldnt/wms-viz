import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';


@Injectable()
export class LayerRefreshService {
  private listeners=new Subject<any>();

  listen():Observable<any>{
    return this.listeners.asObservable();
  }

  refresh(msg:string){
    this.listeners.next(msg)
  }
}
