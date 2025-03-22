export function convertTitleToFileNameBase(str: string) {
  // Convert to lowercase
  let newStr = str.toLowerCase()

  // Replace accented characters with their non-accented equivalents
  newStr = newStr.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  // Replace spaces with dashes
  newStr = newStr.replace(/ /g, '-')

  // Replace special characters with dashes
  newStr = newStr.replace(/[^a-z0-9-]/g, '-')

  // Remove consecutive dashes
  newStr = newStr.replace(/-+/g, '-')

  // Replace "ñ" with "n"
  newStr = newStr.replace(/ñ/g, 'n')

  return newStr
}
