export const boardYRelativeToFocus = ({ boardFocusY, boardHeight, innerHeight, mouseOffsetY }) => {
    return (y) => {
        return (((y - boardFocusY)  / (boardHeight / 2)) * 500)
            + (innerHeight / 2) + mouseOffsetY;
    }
};

export const boardXRelativeToFocus = ({ boardFocusX, boardWidth, innerWidth, mouseOffsetX }) => {
    return (x) => {
        return (((x - boardFocusX)  / (boardWidth / 2)) * 500)
            + (innerWidth / 2) + mouseOffsetX;
    }
};