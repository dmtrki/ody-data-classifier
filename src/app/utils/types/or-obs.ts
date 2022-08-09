import { Observable } from 'rxjs'

export type OrObs<G> = G | Observable<G>

export type Ob$<T> = Observable<T>
