## v1.18.5

feature:

- redo overdue once per day
- show todo thoughts to review
- expected time is in seconds

## v1.18.2

feature:

- show timeline for active projects

## v1.18.1

bug fix:

- set date for review correctly
- paragraph summary
- show text for diabled input; show lessons input
- add switch

## v1.18.0

feature:

- add reading feature
- add why too late input

bug fix:

- disable todo title and note after finished
- change too late ratio to 1.2
- save date and mode of review
- if planned is 0, but finished is not 0, then ratio should be 1
- add purple color to line chart
- show full done days in line chart

## v1.17.2

bug fix:

- fix storage usage typo

## v1.17.1

bug fix:

- fix finished ratio typo

## v1.17.0

feature:

- add storage setting
- add finished of selected range to report
- add browser support page

bug fix:

- save current tab of report
- fix datepicker on iphone 5
- not show start if there are no todos
- not show done if there are no done todos

## v1.16.7

bug fix:

- remove the outline of icon
- get one 1 week + 1day's todos
- move done to bottom of todo status picker
- show current thought only when todo is doing
- add a tab to only show thoughts of a todo
- add thoughts back, to top bar

## v1.16.6

bug fix:

- show less report
- show headphone correctly
- not show nav and up down arrow when typing on mobile

## v1.16.5

bug fix:

- increase app header z index
- show headphone when start todo
- show activity id

## v1.16.4

bug fix:

- make theme color the same as primary color

## v1.16.3

bug fix:

- set theme color to black correctly

## v1.16.2

bug fix:

- set theme color to black correctly

## v1.16.1

bug fix:

- try to set theme color to black correctly(failed)

## v1.16.0

feature:

- rename navigation
- add app header

bug fix:

- fix today's expected time

## v1.15.19

bug fix:
- make sure sub project never be red
- if search field is empty, show no result

## v1.15.18

bug fix:

- sub project will never be red
- listen to window active event on todo detail page
- not show todos of done projects
- make search case insensitive
- reverse thoughts
- not show today in report chart

## v1.15.17

feature:

- add overdue tab for todos

## v1.15.8

bug fix:

- move expected time on todo page to top
- minor fixes

## v1.15.7

bug fix:

- sort project list by position
- exclude todos not done on today
- load records by mode
- arrow up activities on todo details

## v1.15.6

bug fix:

- navigate projects and habits correctly

## v1.15.5

bug gix:

- also show today's report in chart

## v1.15.4

bug fix:

- make reports a little bit simpler

## v1.15.3

feature:

- move navigation to bottom

## v1.15.2

bug fix:

- only show reports that before today in chart
- 7 hours only checks in progress todos happen on that day
- habit in future should not be red

## v1.15.1

bug fix:

- sort todo on sub project page decreasingly
- newest event comes first on todo detail
- not disable end date on datepicker if status is someday
- enable habit drag drop
- show warning when there are too many todos on one day, and you still want to add more

## v1.14.1

bug fix:

- show done todos right

## v1.14.0

feature:
 
- finish habit

## v1.13.5

feature:

- half finish habit

## v1.13.2

bug fix:

- show default time for timer

## v1.13.1

bug fix:

- time in chart is hours now
- calc used time correctly

## v1.13.0

feature:

- more report chart
- scroll to top bottom
- show time for timer, not percentage
- show all report summary

bug fix:

- make sure start end right

## v1.12.1

feature:

- project timeline

## v1.12.0

feature:

- add urgent todos to today

## v1.11.10

bug fix:

- show someday todos
- show someday projects in project list
- scroll to top on activities

## v1.11.9

feature:

- when select someday, auto select in two weeks
- save used time of time range to database
- add input required handling
- enable drag drop

bug fix;

- always get start end date of sub from database

## v1.11.8

bug fix:

- change process shadow color when time is over
- group projects
- delete wrapper component

## v1.11.7

feature:

- show next week todos

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