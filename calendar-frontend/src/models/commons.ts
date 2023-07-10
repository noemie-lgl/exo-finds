export interface RootState {
  username: string;
}

export interface EventEntity {
  id?: string;
  startDate: Date;
  endDate: Date;
  summary: string;
  description: string;
}
export interface CalendarEvent {
  id?: string;
  name: string;
  start: Date;
  end: Date;
  description: string;
  color: string;
  timed: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
}

export interface CalendarEventWithDayTimeObject {
  event: CalendarEvent;
  day: DayTimeObject;
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
