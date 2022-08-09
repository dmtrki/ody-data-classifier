import { Qualifier } from '../types/qualifier.interface'

export class TitleDateQualifier implements Qualifier<string, number | null> {
  public qualify(title: string): number | null {
    const yearMatches: string[] = title.match(/\d{4}/gm)
    if (yearMatches && yearMatches.length)
      return Math.max(...yearMatches.map(parseInt))
    return null
  }
}
