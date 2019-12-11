/**
 * Author: Julien Henrotte @julien_he
 * Company: UltraSuperNew http://ultrasupernew.com/
 */

/**
 * Modules
 */
const Scene = require('Scene');
const FaceTracking = require('FaceTracking');
const Patches = require('Patches');
const Diagnostics = require('Diagnostics');
const Time = require('Time');

import { isInMouth } from './functions.js';

const root = Scene.root; // Just a shorthand
const face = FaceTracking.face(0); // Track the first face that appear on the screen
const cube = root.find('cube');

/**
 * Points position of the mouth.
 * Init now to use it later on
 */
const mouthPoint = {
    leftX: face.mouth.leftCorner.x,
    leftY: face.mouth.leftCorner.y,
    righttX: face.mouth.rightCorner.x,
    rightY: face.mouth.rightCorner.y,
    topX: face.mouth.upperLipCenter.x,
    topY: face.mouth.upperLipCenter.y,
    bottomX: face.mouth.lowerLipCenter.x,
    bottomY: face.mouth.lowerLipCenter.y
};

/**
 * HArdcoded value of the Device Height
 */
const heightDeviceSpatial = 0.5;

/**
 * Editable
 */
let isMouthOpen = false;
let screenSizeHeight = 0,
screenScaleValue = 0; // Device sizes

/**
 * Get the size / scale of the screen
 */
const screenSizeHeightPX = Patches.getScalarValue('screenSizeHeightPX');
const screenScale = Patches.getScalarValue('screenScale');

/**
 * Current Mouth point location
 */
const leftMouthPoint = Patches.getVectorValue('leftMouthPointScript');
const rightMouthPoint = Patches.getVectorValue('rightMouthPointScript');
const topMouthPoint = Patches.getVectorValue('topMouthPointScript');
const bottomMouthPoint = Patches.getVectorValue('bottomMouthPointScript');

/**
 * Subscribe to the mouth open event
 */
FaceTracking.face(0)
  .mouth.openness.monitor()
  .subscribe(function(event) {
    if (event.newValue > 0.4) {
      // When the mouth is open, we update the position of each corner and send it back to Spark AR.
      Patches.setScalarValue('mouthleftXCorner', mouthPoint.leftX);
      Patches.setScalarValue('mouthleftYCorner', mouthPoint.leftY);

      Patches.setScalarValue('mouthRightXCorner', mouthPoint.righttX);
      Patches.setScalarValue('mouthRightYCorner', mouthPoint.rightY);

      Patches.setScalarValue('topLipsCenterX', mouthPoint.topX);
      Patches.setScalarValue('topLipsCenterY', mouthPoint.topY);

      Patches.setScalarValue('bottomLipsCenterX', mouthPoint.bottomX);
      Patches.setScalarValue('bottomLipsCenterY', mouthPoint.bottomY);
      if (isMouthOpen === false) {
        isMouthOpen = true;
      }
    } else {
        if (isMouthOpen === true) {
            const isElementEaten = isAte(cube, 100);
            if (isElementEaten === true ) {
              Diagnostics.log('You are eating it');
            } else {
              Diagnostics.log('You missed it');
            }
            isMouthOpen = false;
        }
    }
  });


/**
 * Init the Size and Scale Variable
 */
function setDeviceSize() {
  screenSizeHeight = screenSizeHeightPX.pinLastValue();
  screenScaleValue = screenScale.pinLastValue();
}
const timeoutTimer = Time.setTimeout(setDeviceSize, 100);


/**
 * Get Corner and compare to see if mouth is inside a box
 * @param {Object} item // The scoop we want
 * @param {Number} size // Size of the element
 * @returns {Boolean} // True of false
 */
function isAte(item, size) {
    const x = item.transform.position.x.pinLastValue();
    const y = item.transform.position.y.pinLastValue();
    const pourcent = size / 2 / (screenSizeHeight / screenScaleValue);
    const easyMath = heightDeviceSpatial * 100;
    const ratioToAddSub = (easyMath * pourcent) / 100;
  
    const leftPos = x - ratioToAddSub;
    const rightPos = x + ratioToAddSub;
    const topPos = y + ratioToAddSub;
    const bottomPos = y - ratioToAddSub;
  
    // Get each X / Y point of the mouth
    const mouthLeftXPos = leftMouthPoint.x.pinLastValue();
    const mouthLeftYPos = leftMouthPoint.y.pinLastValue();
  
    const mouthRightXPos = rightMouthPoint.x.pinLastValue();
    const mouthRightYPos = rightMouthPoint.y.pinLastValue();
  
    const mouthTopXPos = topMouthPoint.x.pinLastValue();
    const mouthTopYPos = topMouthPoint.y.pinLastValue();
  
    const mouthBottomXPos = bottomMouthPoint.x.pinLastValue();
    const mouthBottomYPos = bottomMouthPoint.y.pinLastValue();

    // Check if we eat the element
    const checkLeftBox = isInMouth(mouthLeftXPos, mouthLeftYPos, leftPos, rightPos, topPos, bottomPos);
    const checkRigttBox = isInMouth(mouthRightXPos, mouthRightYPos, leftPos, rightPos, topPos, bottomPos);
    const checkTopBox = isInMouth(mouthTopXPos, mouthTopYPos, leftPos, rightPos, topPos, bottomPos);
    const checkBottomBox = isInMouth(mouthBottomXPos, mouthBottomYPos, leftPos, rightPos, topPos, bottomPos);
  
    if (checkLeftBox || checkRigttBox || checkTopBox || checkBottomBox) {
        return true;
    } else {
        return false;
    }
  }
