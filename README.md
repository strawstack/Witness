# Witness

A web mockup of a specific Witness puzzle with an extra reward tacked on for completion.

# Live Demo

[View Live Demo](#)

# Screenshot

[![](./screenshot.png)](#)

# Todo

- [x] If you're inside an intersection within a certain radius then let let marker float free to avoid snapping to row/col
- [x] BUG: Start are click captures and holds mousemove event preventing marker from updating underneath start button
- [x] Implement `processLine` add/remove wayPoints
    - [x] Is player moving away or toward the final waypoint?
- [x] Implement `renderLine`
    - [x] SVG line through waypoints, and
    - [x] Final wayPoint to player
- [x] Implement `checkSolution`
    - [x] Hash wayPoints and XOR with secret

- [ ] Implement correct `fadePuzzleLine`

- [ ] Line should stop on collision
    - [ ] Note: the mouse can leave below the collision and appear far away
    - [ ] Next wayPoint can only be one of three points
    - [ ] lastWayPoint to marker can only be a short straight line

- [ ] Show box under puzzle with current decoded message

- [ ] Make a script, so others can create their own encoded messages

- [ ] Read encoded message from
