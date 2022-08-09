export interface Matcher {
  firstMatch(substrate, triggers): boolean
  match(substrate, triggers): boolean
  matches(substrate, triggers): string[]
}
