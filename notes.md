## changes:
- fixed animations
- reworked contextMenu so it is in appBody instead of contained within apps (problems with overflow)
- added a close on selection checkbox to date picker
  

## dicsussion
<!-- - should "failed" state be done away with? Make the "failed" state apply to tasks that are not "done" by the end of the day? -->
Next time, use vuex. To be fair, I didn't think the app would need it, but next time just use it instead of a bus. 

## Todo 
- [ ] ---
- [x] History -> previous days, or even next days
- [x] make tasks delete on swipe on mobile
- [x] add ham menu for mobile (left of logo). -> what for?
- [x] make menu/add functionalities happen through a right click menu,
- [ ] parser to convert text into tasks (1. main task ;; 1.1 sub1 ;; 1.2 sub2 ;;);
- [x] finish the controls menu.
- [x] make appTask self contained (no more logic in appTasks). --> doesn't make much sense. the cycle gotta start somewhere
- [x] redo the nextSib thing.
<!-- - [ ] expirement with v-once on controls for performance. -->
- [ ] animations.
- [x] % counter. Not there for accuracy but to provide some psychological feedback. Assumption is that each task = 1/total %.

## Features to add
- search -> searches tasks/subtasks, brings task + highlights matches.
- themes -> bright, dark, and different color schemes.
- keyboard shortcuts.
- Week/general tabs.

## Bugs
- cursor not blinking on new task. Believed to be caused by empty innerText. cursor in nonEmpty innerText does blink
<!-- - cursor one letter behind when editing -->
