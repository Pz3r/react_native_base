const getCurrentDatetimeAsString = () => {
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();
  const hours = today.getHours()
  const minutes = today.getMinutes()

  return {
    date: `${yyyy}${mm}${dd}`,
    monthDay: `${mm}${dd}`,
    time: `${hours}${minutes}`
  }
}

export default getCurrentDatetimeAsString