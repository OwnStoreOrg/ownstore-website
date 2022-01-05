import dayjs from 'dayjs'

export const getFormattedDateTime = (date: Date): string => {
  const dateTime = dayjs(date).format('MMM DD[,] YYYY [at] HH:mm')
  return dateTime
}
