/**
 * Check if at least one mouth point inside a Canvas / Rectangle.
 * This will be used to determine if the user is gaining point or not
 * @param {Number} mouthX       Position on X axis of the mouth point
 * @param {Number} mouthY       Position on Y axis of the mouth point
 * @param {Number} leftPoint    Left edge of our Canvas / Rectangle
 * @param {Number} rightPoint   Right edge of our Canvas / Rectangle
 * @param {Number} topPoint     Top edge of our Canvas / Rectangle
 * @param {Number} bottomPoint  Bottom edge of our Canvas / Rectangle
 * @return {Boolean} True / False
 */
export function isInMouth(mouthX, mouthY, leftPoint, rightPoint, topPoint, bottomPoint) {
    if (mouthX > leftPoint && mouthX < rightPoint) {
        if (mouthY > bottomPoint && mouthY < topPoint) {
        return true;
        } else {
        return false;
        }
    } else {
        return false;
    }
}
