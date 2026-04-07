/** css-tree 无官方 typings；仅声明本项目用到的 API，避免依赖 @types/css-tree 与锁文件不同步 */
declare module 'css-tree' {
  export function parse(css: string, options?: unknown): object
  export function clone<T>(node: T): T
  export function toPlainObject(node: object): unknown
}
