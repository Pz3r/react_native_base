const getDateTimeToString = () => {
  const date = new Date()
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'America/Mexico_City',
    }
    const intl = new Intl.DateTimeFormat('es-MX', options)
    const parts = intl.formatToParts(date)
    return `${parts[4].value}${parts[2].value}${parts[0].value}${parts[6].value}${parts[8].value}`
}

export default getDateTimeToString