## v1.11.6

bug fix:

- use project start end date to check happen date

## v1.11.5

bug fix:

- todo's date must be in the range of the project
- move someday todo to middle of sub project

## v1.11.4

feature:

- add used time of current to report page

## v1.11.3

bug fix:

- deployed v1.11.2 in a wrong branch, which means some stuff are not deployed

## v1.11.2

feature:

- add report chart

bug fix:

- add used time to todo when stop

## v1.11.1

bug fix:

- handle differenct kinds of report correctly

## v1.11.0

feature:

- timeline item has a max length

bug fix:

- fix `this week` logic on todos page
- change `on today` to `for today`
- if today started, the default date for datepicker is tomorrow
- diable todo detail page when finished
- fix the projects order on todo page

## v1.10.0

feature:

- datepicker can select week and month now
- add weekly and monthly report

bug fix:

- sort todo at sub project correctly
- not show someday status on todo detail if today is started
- invalid date can still be selected

## v1.9.2

bug fix:

- not cache overlay component state
- prefill summary input
- id overlap on todo detail page

## v1.9.1

bug fix:

- load todos for today on report page

## v1.9.0

feature:

- add record page

## v1.8.9

bug fix:

- update sub project start end date when todo is created or happenDate is changed

## v1.8.8

bug fix:

- get todos when set date inout for report stats

## v1.8.7

bug fix:

- fix get todos for report error

## v1.8.6

feature:

- add daily report

## v1.8.5

bug fix:

- auto reload after creating something
- someday todos are not part of project chart
- disable today if today started for date picker

## v1.8.4

feature:

- only enable start end today button for today
- show expected time also for week
- add popup for start or end today
- lock date picker if today started

## v1.8.3

bug fix:

- sorting on todo page
- green first, red second

feature:

- start today and end today(not finished)

## v1.8.2

bug fix:

- data for project chart should be increasing

## v1.8.1

bug fix:

- fix parsing array error

## v1.8.0

feature:

- use dexie for storage

## v1.7.2

bug fix:

- not show start end date for sub if there is non
- fix cannot show todo details for todos that in the future

## v1.7.1

feature:

- show start end date and status for sub project
- style first letter of todo

bug fix:

- delete ng-content from project list
- change action place on laptop
- only change timer if expectedTime is changed


## v1.7.0

feature:

- show index of todo

bug fix:

- make timer shorter
- delete prepend

## v1.6.0

feature:

- only show still needed expected time, and show it for every project

## v1.5.1

bug fix:

- set default min max for duration picker to minute

## v1.5.0

feature:

- set todo to purple if there is no expected time
- order active todos: overdue, in progress, waiting
- set default duration to minute
- Not show time for this week tab
- Overdue cant change happen date
- move all back button to top
- Show only today's done
- Stop timer when done

## v1.4.0

feature:

- show expected time of today and tomorrow
- turn setting to a icon

## v1.3.0

feature:

- change 3 days to tomorrow
- make a overdue todo red

## v1.2.0

feature:

- add won't do to todos
- group todos

## v1.1.1

bug:

- delete done button and move back button to top on todo detail page


## v1.1.0

feature:

- can change project and todo status