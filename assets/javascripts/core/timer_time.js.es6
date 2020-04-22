export class TimerTime {
  constructor(label, time) {
    this.label = label
    this.time = time
  }

  get timeForDisplay() {
    return this.label
  }

  get formattedTime() {
    return TimerTime.dateToYYYYMMDDHHMM(this.time)
  }

  getCurrentTime() {
    return (new Date()).getTime()
  }

  static dateToYYYYMMDDHHMM(date) {
    const targetDate = new Date(date)
    return (targetDate.getFullYear() + '-' + ('0' + (targetDate.getMonth() + 1)).slice(-2) + '-' + ('0' + targetDate.getDate()).slice(-2) + ' ' + targetDate.getHours() + ':' + ('0' + (targetDate.getMinutes())).slice(-2))
  }
}

export class TimerTimeFromNow extends TimerTime {
  constructor(label, millisecondsToAdd) {
    super(label, new Date())
    this.time = new Date(this.getCurrentTime() + millisecondsToAdd)
  }

  static createWithHour(label, hourToAdd) {
    const millisecondsToAdd = hourToAdd * 60 * 60 * 1000
    return new TimerTimeFromNow(label, millisecondsToAdd)
  }
}

export class TimerTimeWithSpecificMoment extends TimerTime {
  constructor(label, year, month, day, hours, minutes) {
    super(label, new Date())
    this.time = new Date(year, month, day, hours, minutes, 0, 0)
  }

  static createWithNextDaysAndHour(label, nextDays, hour) {
    const current = new Date()
    const year = current.getFullYear()
    const day = current.getDate() + nextDays
    const month = current.getMonth()
    const minutes = 0

    return new TimerTimeWithSpecificMoment(label, year, month, day, hour, minutes)
  }
}
