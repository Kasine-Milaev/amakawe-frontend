const translationDict = {
  'Fire': 'Огонь',
  'Flame': 'Пламя',
  'Brigade': 'Бригада',
  'Force': 'Силы',
  'Dragon': 'Дракон',
  'Ball': 'Жемчуг',
  'Super': 'Супер',
  'Hero': 'Герой',
  'Academia': 'Академия',
  'Attack': 'Атака',
  'Titan': 'Титан',
  'One': 'Один',
  'Piece': 'Кусок',
  'Naruto': 'Наруто',
}

export const translateTitle = (title) => {
  if (!title) return ''
  let translated = title
  Object.keys(translationDict).forEach(eng => {
    const regex = new RegExp(`\\b${eng}\\b`, 'gi')
    translated = translated.replace(regex, translationDict[eng])
  })
  
  return translated
}

export const shouldTranslate = (element) => {
  return !element.closest('[translate="no"]') && 
         !element.closest('.notranslate')
}