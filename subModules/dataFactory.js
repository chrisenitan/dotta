const tools = {
  realNextPeriod: (advanceByMonth) => {
    const newDate = new Date()
    const actualMonthPeriod = newDate.getMonth() + advanceByMonth
    const currentRealMonth = actualMonthPeriod > "11" ? 0 : actualMonthPeriod
    const currentRealYear = actualMonthPeriod > "11" ? newDate.getFullYear() + 1 : newDate.getFullYear()
    return { realMonth: parseInt(currentRealMonth), realYear: parseInt(currentRealYear) }
  },

  monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

  dateForMonth: (request) => {
    const dateObj = new Date()
    if (request.date <= dateObj.getDate()) {
      //push to next month only if deadline has passed
      const { realMonth, realYear } = tools.realNextPeriod(1)
      return { month: realMonth, year: realYear }
    } else {
      //same month but in a few days
      const { realMonth, realYear } = tools.realNextPeriod(0)
      return { month: realMonth, year: realYear }
    }
  },

  dateForWeek: (request) => {
    const proposedDate = parseInt(request.date) + 7
    let periodOffset = 0
    let newDate = 0
    if (proposedDate <= 31) {
      newDate = parseInt(request.date) + 7
    } else {
      newDate = 7 - Math.abs(31 - proposedDate)
      periodOffset = 1
    }
    const { realMonth, realYear } = tools.realNextPeriod(periodOffset)
    return { month: realMonth, year: realYear, date: newDate }
  },
}

module.exports = { tools }
