export type ExtractInstance<T> = T extends new () => infer R ? R : never

export type InstanceMap<T, C> = Partial<Record<keyof T, ExtractInstance<C>>>
export type InstanceSet<T> = Partial<Array<ExtractInstance<T>>>
