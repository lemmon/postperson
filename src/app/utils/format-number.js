new Intl.NumberFormat()

export default (num, dec = 0, locale = 'en') =>
  new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  }).format(num)
