export class TouchController {
  constructor() {
    this.elem = document.querySelector('.mobile-controller');
    this.bar = document.querySelector('.mobile-controller-bar');
    this.setPosition();
    
    this.elem.addEventListener('touchstart', event => {
      this.walkTouch = event.targetTouches[0];
    });

    this.elem.addEventListener('touchmove', event => {
      this.walkTouch = event.targetTouches[0];
    });

    this.elem.addEventListener('touchend', event => {
      this.walkTouch = null;
    });
  }

  setPosition() {
    console.log('setposition');
    this.boundingRect = this.elem.getBoundingClientRect();
    this.width = this.boundingRect.width;
    this.height = this.boundingRect.height;
    this.x = this.boundingRect.x;
    this.y = this.boundingRect.y;
    this.cx = this.x + this.width/2;
    this.cy = this.y + this.height/2;
  }

  setAngleOfBar(radian) {
    this.bar.style.transform = `rotate(${radian * 180 / Math.PI + 90}deg)`;
  }
}