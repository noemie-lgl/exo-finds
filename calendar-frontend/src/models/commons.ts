export interface CalendarEvent {
  id: string;
  name: string;
  start: Date;
  end: Date;
  color: string;
  timed: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
}

export interface DayTimeObject {
  date: string;
  time: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: number;
  hasDay: boolean;
  hasTime: boolean;
  past: boolean;
  present: boolean;
  future: boolean;
  week: [
    {
      date: string;
      time: string;
      year: number;
      month: number;
      day: number;
      hour: number;
      minute: number;
      weekday: number;
      hasDay: boolean;
      hasTime: boolean;
      past: boolean;
      present: boolean;
      future: boolean;
    }
  ];
  nativeEvent: MouseEvent;
}
