## changes:
- fixed task-controls width sizing problem through "flex-shrink: 0";
- added the %done counter;
- made it so if all the subtasks are green, the parent is made green; The other way could be implemented (if parent is red, all children are red) but I feel that there's value in knowing which subtasks were accomplished even when the main task failed.

## Todo 
- [x] finish the controls menu.
- [x] make appTask self contained (no more logic in appTasks). --> doesn't make much sense. the cycle gotta start somewhere
- [x] redo the nextSib thing.
- [ ] expirement with v-once on controls for performance.
- [ ] animations.
- [ ] % counter. Not there for accuracy but to provide some psychological feedback. Assumption is that each task = 1/total %.

## Features to add
- search -> searches tasks/subtasks, brings task + highlights matches.
- themes -> bright, dark, and different color schemes.
- keyboard shortcuts.
- Week/general tabs.

## Bugs
- cursor not blinking on new task. Believed to be caused by empty innerText. cursor in nonEmpty innerText does blink