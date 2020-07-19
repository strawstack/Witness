// MxZCSVRUEWoMDRRdBREXNFpQUUJQGQZbWVdJEhBcChcQV1oCEw5WXUxZF0sIQV8RTUkXAh0eQhFGTBpcExcRWgZNW1xVHkZYFwIKBxcNbgBlUUZ4Z1IIcWo=
const DEFAULT_ENCODING = "NwwYUEpUUE0GQQMYAkVEEFlYEEJQWhFQRxhdVxdHAgNVE1MOCg9cRBhMDVcSCFkWTUsRW0ZYWghCQgtWFAZeGAsXTENLCx4WBAgWUBRSGQdZWB9CQUsCQkBMUVEPGzQNRF1QEhU=";
function mousePosition(e) {
    const t = e.target;
    const box = t.getBoundingClientRect();
    return {
        x: e.clientX - box.x,
        y: e.clientY - box.y
    };
}
function boardPosition(e) {
    const m = mousePosition(e);
    const offset = {
        x: 50,
        y: 50
    };
    return {
        x: m.x - offset.x,
        y: m.y - offset.y,
        mouse: m
    };
}
function position(e) {
    const b = boardPosition(e);
    let row = 0; // Default values
    let col = 0;
    if (b.x > 90) {
        col = Math.floor((b.x - 90) / 135) + 1;
        if (col > 4) col = 4;
    }
    if (b.y > 90) {
        row = Math.floor((b.y - 90) / 135) + 1;
        if (row > 4) row = 4;
    }
    if (b.x > 585 && b.y < 0) {
        return {
            row: -1,
            col: 5,
            board: b
        };
    } else {
        return {
            row: row,
            col: col,
            board: b
        };
    }
}
function clamp(value, min, max) {
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    }
    return value;
}
function nearestValidPoint(pos) {
    const rowCenter = 45/2 + pos.row * 135;
    const colCenter = 45/2 + pos.col * 135;
    const distRow = Math.abs(rowCenter - pos.board.y);
    const distCol = Math.abs(colCenter - pos.board.x);
    const pad = 2.5;
    const mr = 20 + pad; // markerRadius
    const freeRad = 5;
    if (distRow < freeRad && distCol < freeRad) {
        return {
            x: clamp(pos.board.x, mr, 585 - mr),
            y: clamp(pos.board.y, mr, 585 - mr),
            pos: pos
        };
    } else if (distRow < distCol) {
        return {
            x: clamp(pos.board.x, mr, 585 - mr),
            y: pos.row * 135 + 45/2,
            pos: pos
        };
    } else {
        return {
            x: pos.col * 135 + 45/2,
            y: clamp(pos.board.y, mr, 585 - mr),
            pos: pos
        };
    }
}
function positionMarker(marker, point) {
    const mr = marker.offsetWidth; // markerRadius
    marker.style.left = (point.x - mr/2) + "px";
    marker.style.top = (point.y - mr/2) + "px";
    if (point.pos.row === -1 && point.pos.col === 5) {
        marker.style.left = (4 * 135 + 2.5 + 40) + "px";
        marker.style.top = (0 * 135 + 2.5 - 40) + "px";
    }
}
function vecFromWayPoint(wayPoint) {
    // wayPoint containing row and col
    // returned as x, y point vect representing wayPoint
    return {
        x: wayPoint.c * 135 + 45/2,
        y: wayPoint.r * 135 + 45/2
    };
}
function vecFromInterPoint(point) {
    return {
        x: point.pos.col * 135 + 45/2,
        y: point.pos.row * 135 + 45/2,
    };
}
function vecSubtract(va, vb) {
    // vector va - vb
    // Means vector where vb points to va
    return {
        x: va.x - vb.x,
        y: va.y - vb.y
    };
}
function dot(v1, v2) {
    // Dot product of vectors
    return v1.x * v2.x + v1.y * v2.y;
}
function mag(v) {
    // Magnitude of vector
    return Math.sqrt(
        Math.pow(v.x, 2) + Math.pow(v.y, 2)
    );
}
function rad2Deg(rad) {
    return rad / Math.PI * 180;
}
function angleBetween(v1, v2) {
    const d = dot(v1, v2);
    const prod = mag(v1) * mag(v2);
    return Math.abs(rad2Deg(Math.acos(d/prod)));
}
function between(p1, p2, p3) {
    // Is p1 between p2 and p3
    const min = Math.min(p2, p3);
    const max = Math.max(p2, p3);
    return min < p1 && p1 < max;
}
function samePoint(p1, p2) {
    // Two points that have r and c properties
    // are they the same
    return (p1.r === p2.r) && (p1.c === p2.c);
}
function pushIfDifferent(wayPoints, newPoint) {
    const len = wayPoints.length
    const last = wayPoints[len - 1];
    if (last.r !== newPoint.r || last.c !== newPoint.c) {
        wayPoints.push(newPoint);
    }
}
function processLine(wayPoints, point) {
    // Should we add or remove wayPoints
    // based on the marker's current position

    // If player enters the win state,
    // Make sure to set final waypoint and nothing else
    if (point.pos.row === -1 && point.pos.col === 5) {
        pushIfDifferent(wayPoints, {
            r: 0, c: 4
        });
        return;
    }

    // If marker is between last and second last wayPoint,
    // remove the last wayPoint
    const len = wayPoints.length;
    const last = wayPoints[len - 1];
    const lastVec = vecFromWayPoint(last);
    if (len >= 2) {
        const sndLast = wayPoints[len - 2];
        const sndLastVec = vecFromWayPoint(sndLast);
        if (last.r === sndLast.r && sndLast.r === point.pos.row) {
            if (between(point.x, lastVec.x, sndLastVec.x)) {
                // Marker is between last two wayPoints
                wayPoints.pop();
            }
        } else if (last.c === sndLast.c && sndLast.c === point.pos.col) {
            if (between(point.y, lastVec.y, sndLastVec.y)) {
                // Marker is between last two wayPoints
                wayPoints.pop();
            }
        }
    }

    // Closest intersection
    const interVec = vecFromInterPoint(point);
    const interMarkerVec = vecSubtract(point, interVec);
    const interLastVec = vecSubtract(lastVec, interVec);

    const ang = angleBetween(interMarkerVec, interLastVec);
    const slack = 5;

    // Is the angle about 90deg
    // Indicating a right turn has occured
    // (else if) Is the angle 0deg
    // Indicating both vectors are in the same direction
    if (Math.abs(ang - 90) < slack) {
        pushIfDifferent(wayPoints, {
            r: point.pos.row,
            c: point.pos.col
        });
    } else if (Math.abs(ang - 180) < slack) {
        pushIfDifferent(wayPoints, {
            r: point.pos.row,
            c: point.pos.col
        });
    }
}
function wayPointToRenderCommand(wayPoint, letter) {
    const x = wayPoint.c * 135 + 45/2 + 50;
    const y = wayPoint.r * 135 + 45/2 + 50;
    return `${letter} ${x} ${y}`;
}
function renderLine(wayPoints, point, puzzleLine) {
    // Render the SVG line using the current waypoints
    // and the marker's position
    let d = [wayPointToRenderCommand(wayPoints[0], "M")];
    for (let i = 1; i < wayPoints.length; i++) {
        d.push(
            wayPointToRenderCommand(wayPoints[i], "L")
        );
    }

    // Special render for win state
    if (point.pos.row === -1 && point.pos.col === 5) {
        d.push(`L ${50 + 585 - 45/2 + 40} ${50 + 45/2 - 40}`);
    } else { // Otherwise connect lastWayPoint with current point
        d.push(`L ${point.x + 50} ${point.y + 50}`);
    }
    const d_str = d.join(" ");
    puzzleLine.setAttribute("d", d_str);
}
function checkSolution(wayPoints, ENCODED_MESSAGE) {
    // Combine hash of wayPoints with secret string
    // to reveal success message
    const result = combineWayPointsWithEncodedMsg(
        wayPoints,
        ENCODED_MESSAGE
    );
    return result;
}
function fadePuzzleLine(puzzleLine) {
    // Cause puzzle line to fade
    // Until player clicks start again
    puzzleLine.style.opacity = 0;
}
function inStartArea(e) {
    const m = mousePosition(e);
    const startCenter = {
        x: 50 + 45/2,
        y: 585 + 100 - 50 - 45/2
    };
    const startRadius = 50;
    const dist = (a,b) => {
        return Math.sqrt(
            Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)
        );
    };
    return dist(m, startCenter) <= startRadius;
}
function messageToIntArray(message) {
    let msgIntArray = [];
    for (let c of message) {
        const charCode = c.charCodeAt(0);
        msgIntArray.push(charCode);
    }
    return msgIntArray;
}
function intArrayToMessage(intArray) {
    let message = [];
    for (let c of intArray) {
        const char = String.fromCharCode(c);
        message.push(char);
    }
    return message.join("");
}
function hashWayPoint(wayPoint) {
    return `${wayPoint.r}:${wayPoint.c}`;
}
function hashWayPointList(wayPoints) {
    let hash = [];
    for (let wayPoint of wayPoints) {
        hash.push(hashWayPoint(wayPoint));
    }
    return hash.join(";");
}
function combineWayPointsWithEncodedMsg(wayPoints, encodedMessage) {
    const _hash = hashWayPointList(wayPoints);
    const hash = sha256(_hash);
    const hashIntArray = messageToIntArray(hash);
    const hashLen = hashIntArray.length;
    const secretIntArray = messageToIntArray(atob(encodedMessage));
    let combine = [];
    for (let i = 0; i < secretIntArray.length; i++) {
        combine.push(
            secretIntArray[i] ^ hashIntArray[i % hashLen]
        );
    }
    return intArrayToMessage(combine);
}
function makeEncoded(wayPoints, message) {
    const _hash = hashWayPointList(wayPoints);
    const hash = sha256(_hash);
    const hashIntArray = messageToIntArray(hash);
    const hashLen = hashIntArray.length;
    const secretIntArray = messageToIntArray(message);
    let combine = [];
    for (let i = 0; i < secretIntArray.length; i++) {
        combine.push(
            secretIntArray[i] ^ hashIntArray[i % hashLen]
        );
    }
    return btoa(intArrayToMessage(combine));
}
function getEncodedMessageOrDefault() {
    const _queryString = window.location.search;
    const queryString = _queryString.replace("%3D", "=");
    try {
        const regex = /\?msg=(.+?)($|&)/i;
        const msg = queryString.match(regex);
        return msg[1]; // First capture group
    } catch(e) {
        return DEFAULT_ENCODING;
    }
}

function main() {
    const svg = document.querySelector(".rh-svg");
    const marker = document.querySelector(".marker");
    const start = document.querySelector(".start");
    const puzzleLine = document.querySelector(".puzzle-line");
    const sm = document.querySelector("#secret-message");

    const ENCODED_MESSAGE = getEncodedMessageOrDefault();

    let wayPoints = [];
    let active = false;
    let finalPoint = undefined;

    svg.addEventListener("mousemove", e => {
        const pos = position(e);
        const point = nearestValidPoint(pos);
        positionMarker(marker, point);
        if (active) {
            processLine(wayPoints, point);
            renderLine(wayPoints, point, puzzleLine);
            const len = wayPoints.length;
            const last = wayPoints[len - 1];
            if (point.pos.row === -1 && point.pos.col === 5) {
                const result = checkSolution(wayPoints, ENCODED_MESSAGE);
                // This will be the success message/url or
                // essentially a random string
                sm.innerHTML = result;
                // console.log(makeEncoded(wayPoints, "To create your own secret message, edit this text, uncomment this line, and obtain the encoded message from the console after correctly solving the puzzle"));
            }
        }
    });

    const activate = () => {
        // Activate
        active = true;

        puzzleLine.style.transition = "opacity 0s";
        puzzleLine.className = "puzzle-line";
        puzzleLine.style.opacity = 1;
        puzzleLine.setAttribute("d", "");

        start.style.transition = "background 0s";
        start.className = "start active";
        marker.className = "marker hidden";

        const startCoord = { r: 4, c: 0 };
        wayPoints = [startCoord];
    };
    const deactivate = e => {
        // Deactivate
        start.style.transition = "background 2s";
        start.className = "start";

        marker.className = "marker";
        active = false;
        const pos = position(e);
        const point = nearestValidPoint(pos);
        finalPoint = point;
        puzzleLine.style.transition = "opacity 2s";
        fadePuzzleLine(puzzleLine);
    };
    svg.addEventListener("click", e => {
        if (inStartArea(e) && !active) {
            activate();
        } else {
            deactivate(e);
        }
    });
    svg.addEventListener("mouseout", e => {
        deactivate(e)
    });
}
window.onload = main;
