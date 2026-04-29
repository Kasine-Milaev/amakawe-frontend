export async function translateText(text, targetLang = 'ru') {
  if (!text) return ''
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    )
    const data = await response.json()
    return data[0][0][0]
  } catch (error) {
    console.error('Ошибка перевода:', error)
    return text
  }
}