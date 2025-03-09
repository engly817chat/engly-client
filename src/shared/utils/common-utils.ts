/**
 * Создает новый объект без указанных свойств
 * @param obj - Исходный объект
 * @param properties - Массив ключей свойств для исключения
 * @returns Новый объект без указанных свойств
 */
export const excludeProperties = <
  T extends Record<string, unknown>,
  K extends keyof T,
>(
  obj: T,
  properties: K[],
): Omit<T, K> => {
  const result = { ...obj }
  properties.forEach(property => delete result[property])
  return result
}
