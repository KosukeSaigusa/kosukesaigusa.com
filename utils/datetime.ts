// Date オブジェクトを受け取って曜日の文字列を返す
export const japaneseDayOfWeek = (date: Date): string => {
  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土']
  const obj = new Date(date)
  return dayOfWeek[obj.getDay()]
}

// Date オブジェクトを受け取って yyyy-mm-dd の文字列を返す
export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date(date).toLocaleDateString('ja', options)
}
