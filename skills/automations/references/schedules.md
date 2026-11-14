# Schedules

The schedule properties are the parts of an iCalendar recurrence rule (RFC 5545 RRULE). The sync builds the rule from them, so set properties, never rule text.

| Property | Type | Rule part |
| --- | --- | --- |
| Start | Date with a time | `DTSTART`, the first run |
| Time zone | An IANA name, such as `Europe/Madrid` | `TZID`, the zone every run keeps its local time in |
| Repeat | `Once`, `Minutely`, `Hourly`, `Daily`, `Weekly`, `Monthly`, `Yearly` | `FREQ` |
| Every | Number, empty means 1 | `INTERVAL` |
| Days | `Mon` to `Sun` | `BYDAY` |
| Days of month | `1` to `31`, `Last` | `BYMONTHDAY` |
| Months | `Jan` to `Dec` | `BYMONTH` |
| Hours | `00` to `23` | `BYHOUR` |
| Minutes | `00`, `05` to `55` | `BYMINUTE` |
| Occurrence | `1st`, `2nd`, `3rd`, `4th`, `Last` | `BYSETPOS` |
| Limit | Number, the most times it runs | `COUNT` |
| Until | Date | `UNTIL` |

## Rules

1. Start, Time zone and Repeat are required. Notion keeps only the offset of Start, not its zone, so Time zone is what keeps runs at the same local time across daylight-saving changes. Add a missing zone as a new option.
2. Repeat `Once` runs at Start. Leave every other schedule property empty: the sync rejects the row otherwise.
3. Without Hours and Minutes, each run happens at Start's time. With them, Start only sets the first day. Until is a date and includes that whole day.
4. Occurrence picks among the runs the other properties produce in each period. It needs Days or Days of month to choose from.
5. Use Limit or Until, not both.
6. Leave a property empty rather than selecting every option.

## Examples

| Request | Properties |
| --- | --- |
| Once, 20 Nov 2026 at 09:00 Berlin | Repeat `Once`, Start 2026-11-20 09:00, Time zone `Europe/Berlin` |
| Weekdays at 09:00 | Repeat `Weekly`, Days `Mon` to `Fri`, Start a day at 09:00 |
| Weekdays at 09:00 and 17:00 | Repeat `Weekly`, Days `Mon` to `Fri`, Hours `09` `17`, Minutes `00` |
| Every 15 minutes, 09:00 to 17:45, weekdays | Repeat `Weekly`, Days `Mon` to `Fri`, Hours `09` to `17`, Minutes `00` `15` `30` `45` |
| Every other Monday at 08:00 | Repeat `Weekly`, Every 2, Days `Mon`, Start a Monday at 08:00 |
| Last working day of each month at 17:00 | Repeat `Monthly`, Days `Mon` to `Fri`, Occurrence `Last`, Start at 17:00 |
| First Monday of each quarter | Repeat `Monthly`, Every 3, Days `Mon`, Occurrence `1st`, Start in a quarter's first month |
| 1st and 15th of each month | Repeat `Monthly`, Days of month `1` `15` |
| Every 31 March | Repeat `Yearly`, Months `Mar`, Days of month `31` |
| Daily at 07:00, ten times | Repeat `Daily`, Limit 10, Start at 07:00 |
| Daily at 07:00 until year end | Repeat `Daily`, Until 2026-12-31, Start at 07:00 |

The examples are tested in Notion Code (`test/automations/row.test.ts`), each with its run times. Set Time zone on every one.

A schedule these properties can't express, such as a list of skipped dates, needs a decision from the person, not a workaround.
