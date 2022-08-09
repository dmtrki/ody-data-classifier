import { Observable } from 'rxjs'

export interface Qualifier<IN, OUT> {
  qualify(data: IN): OUT
}
