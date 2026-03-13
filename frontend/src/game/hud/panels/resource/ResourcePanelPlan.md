Goals:
Select different modes.
Visualise the cards held by a user.
Handle input = 'esc', 'clicks', 'hovering'


# Plan

## Resource Panel Manager
Holding the current mode and firing the onEnter and onExit
Listening to global events
Pass the normalized inputs to the modes


### Browse Mode
Default mode
Show hovering effects
Enter Trade Mode when a resource is clicked
Nothing on dev cards for now

### Trade Mode
Show 4 panels 'hand', 'offering', 'wanted', 'resources'.
When clicking a hand card, it should move to offering and vice versa
When clicking a resource it should move to wanted and vice versa

Should have 3 additional buttons 'Cancel', 'Trade with players', 'Trade with bank'.
Should have hover effects on all cards.

### Discard Mode
Show the single panel
Should allow multiple cards to be selected and deselected
Should have a button to confirm selection