import { parse, clone, toPlainObject } from 'css-tree'

/** 将 CSS 字符串解析为 css-tree AST，再格式化为 JSON（供剪贴板使用） */
export function cssToJsonString(css: string): string {
  const ast = parse(css)
  const plain = toPlainObject(clone(ast))
  return JSON.stringify(plain, null, 2)
}
