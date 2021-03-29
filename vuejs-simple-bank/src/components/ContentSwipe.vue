// Dependencies: Vue, HammerJS (touch library), & Lodash debounce function
// Full tutorial available at
// https://medium.com/@elenaczubiak/swipe-navigation-carousel-for-vue-tutorial-d647b7dc7174
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Hammer from 'hammerjs';
import debounce from 'lodash.debounce';

@Component({
  components: {  }
})
export default class ContentSwipe extends Vue {
  @Prop() lessons!: any[];
  @Prop({ default: 0 }) initial!: number;

  isInfiniteLoop = false; // Whether to loop back to start of item array when reaching the end
  prefersReducedMotion = false;
  currentIndex = 0;
  upcomingIndex = 0;
  translateX = 0;
  maxTranslateX = 0;
  transformStyle = "translateX(0)";
  transitionClass = "transition-initial";
  isTransitioning = false;
  leftEdgeScale = 0;
  rightEdgeScale = 0;

  // Returns array of objects with id & key for each item
  // For the v-for loop, each slide needs a stable and unique key
  get infoItems() {
    let arr = [...this.lessons];
    // If there are only 2 items, double array to always have odd number in renderedItems
    if (arr.length === 2) {
      arr = [...arr, ...arr];
    }
    return arr.map((lesson, index) => ({
      id:(lesson.id+''+index),
      key: `${lesson.id}-${index}`,
      value: lesson
    }));
  }

  // Return array of objects for the 3 items to be rendered in the DOM at the moment
  // Includes the previous, current, and next slides
  get renderedItems() {
    const { currentIndex: i, infoItems } = this;

    // console.log('---- DBG: infoItems',this.infoItems);
    if (infoItems.length === 1) {
      return [this.lessons[0],this.lessons[0],this.lessons[0]];
    }

    const lastIndex = this.infoItems.length - 1;
    const prevIndex = i === 0 ? lastIndex : i - 1;
    const nextIndex = i === lastIndex ? 0 : i + 1;

    // console.log('---- DBG: currentIndex',this.currentIndex);
    // console.log('---- DBG: index',prevIndex,i,nextIndex, this.infoItems);
    // console.log('---- DBG: lessons',prevIndex,i,nextIndex, this.lessons);
    return [this.infoItems[prevIndex].value, this.infoItems[i].value, this.infoItems[nextIndex].value];
  }

  get isNextAvailable() {
    const { lessons, currentIndex, isInfiniteLoop } = this;
    return (
      currentIndex < lessons.length - 1 ||
      (isInfiniteLoop && lessons.length !== 1)
    );
  }

  get isPreviousAvailable() {
    const { lessons, currentIndex, isInfiniteLoop } = this;
    return currentIndex > 0 || (isInfiniteLoop && lessons.length !== 1);
  }

  mounted() {
    // use prop to initiate the currentIndex;
    this.currentIndex = this.initial;

    // Set up Hammer element & event listeners to respond to swiping gestures
    const touchContainer = document.getElementById("touch-container");
    const hammer = new Hammer.Manager(touchContainer, {
      recognizers: [
        [Hammer.Pan, { direction: Hammer.DIRECTION_HORIZONTAL }],
        [Hammer.Swipe, { direction: Hammer.DIRECTION_HORIZONTAL }]
      ]
    });
    hammer.on("pan swipe", this.handleTouchEvents);

    // Set up event listeners for when items are transitioning across the screen
    const itemsContainer = document.getElementById("rendered-items-flexbox");
    if(itemsContainer) {
      itemsContainer.addEventListener("transitionstart", (e) => {
        if (e.target === itemsContainer) {
          this.isTransitioning = true;
        }
      });
      itemsContainer.addEventListener("transitionend", (e) => {
        if (e.target === itemsContainer) {
          this.updateCurrentItem();
        }
      });
    }

    // For users who prefer reduced motion, can't rely on transition to change items
    this.prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    this.firstPaint();
  }

  firstPaint(){
    this.upcomingIndex = this.currentIndex;
    this.updateCurrentItem();
  }

  handleTouchEvents(e) {
    const {
      isTransitioning,
      translateX,
      leftEdgeScale,
      rightEdgeScale,
      isPreviousAvailable,
      isNextAvailable
    } = this;
    const { deltaX, deltaY, isFinal } = e;
    // console.log('--- DBG hammer gesture, prev,next',isPreviousAvailable, isNextAvailable)
    // console.log('--- DBG hammer gesture X,Y',deltaX,deltaY)

    // While card is transitioning, don't respond to events
    if (isTransitioning) {
      return;
    }

    // Don't respond to gestures that are more vertical than horizontal
    // (browser will handle vertical scroll)
    // Unless the gesture started horizontal, then respond as normal
    if (
      (Math.abs(deltaX) < 8 || Math.abs(deltaY) - Math.abs(deltaX) > -1) &&
      !translateX &&
      !leftEdgeScale &&
      !rightEdgeScale
    ) {
      return;
    }

    
    if (
      (!isPreviousAvailable && deltaX > 0) ||
      (!isNextAvailable && deltaX < 0)
    ) {
      this.updateEdgeEffect(deltaX, isFinal);
    } else if (isFinal) {
      this.handleGestureEnd(deltaX);
    } else {
      this.handleGestureMove(deltaX);
    }
  }

  handleGestureMove(deltaX) {
    const { maxTranslateX } = this;

    // Record farthest distance in one direction so can check if gesture goes in
    // opposite direction, indicating user doesn't want to change slides
    if (Math.abs(deltaX) > Math.abs(maxTranslateX)) {
      this.maxTranslateX = deltaX;
    }

    // Move items by deltaX amount
    this.translateX = deltaX;
    this.transitionClass = "transition-initial";
    this.transformStyle = `translateX(${deltaX}px)`;
  }

  handleGestureEnd(deltaX?: number) {
    const { translateX, maxTranslateX } = this;

    if (Math.abs(translateX) - Math.abs(maxTranslateX) < -1) {
      // If gesture goes too much in oposite direction, stay on current slide
      this.transitionClass = 'transition-item';
      this.transformStyle = 'translateX(0)';
    } else if (translateX > 0) {
      this.previous();
    } else if (translateX < 0) {
      this.next();
    }
  }

  updateEdgeEffect(deltaX = 0, isFinal = false) {
    if (isFinal) {
      this.transitionClass = "transition-edge";
      this.leftEdgeScale = 0;
      this.rightEdgeScale = 0;
    } else {
      this.transitionClass = "transition-initial";
      const scaleVal = Math.min(0.2 + Math.abs(deltaX) / 50, 1);
      if (deltaX > 0) {
        this.leftEdgeScale = scaleVal;
      }
      if (deltaX < 0) {
        this.rightEdgeScale = scaleVal;
      }
    }
  }

  // Debounce previous & next functions so only triggered by individual gestures
  // FIXME missing debounce
  previous() {
    if (this.isTransitioning) {
      return;
    }

    if (!this.isPreviousAvailable) {
      this.updateEdgeEffect(100, false);
      setTimeout(() => {
        this.updateEdgeEffect(0, true);
      }, 100);
      return;
    }

    const { currentIndex, lessons, prefersReducedMotion } = this;

    this.transitionClass = "transition-item";
    this.transformStyle = "translateX(100vw)";

    const prevIndex =
      currentIndex === 0 ? lessons.length - 1 : currentIndex - 1;
    this.upcomingIndex = prevIndex;

    if (prefersReducedMotion) {
      this.updateCurrentItem();
    }
  }

  // Respond to "next" navigation request
  // Figure out which card is next and call updateCurrentItem
  // FIXME missing debounce
  next (){
    if (this.isTransitioning) {
      return;
    }

    if (!this.isNextAvailable) {
      this.updateEdgeEffect(-100, false);
      setTimeout(() => {
        this.updateEdgeEffect(0, true);
      }, 100);
      return;
    }

    const { currentIndex, lessons, prefersReducedMotion } = this;

    this.transitionClass = "transition-item";
    this.transformStyle = "translateX(-100vw)";

    const nextIndex =
      currentIndex === lessons.length - 1 ? 0 : currentIndex + 1;
    this.upcomingIndex = nextIndex;

    if (prefersReducedMotion) {
      this.updateCurrentItem();
    }
  }

  // If using Vue Router or Vuex, can put that logic here instead of just changing local state
  updateCurrentItem() {
    this.currentIndex = this.upcomingIndex;
    this.$emit('changeCard', this.renderedItems);
    // console.log('---DBG: changeCard',this.renderedItems)
    this.resetTranslate();
  }

  resetTranslate() {
    this.isTransitioning = false;
    this.transitionClass = "transition-initial";
    this.transformStyle = "translateX(0)";
    this.translateX = 0;
    this.maxTranslateX = 0;
  }
}
</script>

<template>

  <!-- 
      TOUCH CONTAINER
      Parent container for area that's responsive to taps and swipes
  -->
  <div id="touch-container">

    <!--
      RENDERED ITEMS FLEXBOX
      A flexbox container that displays items horizontally & centered
    -->
    <div id="rendered-items-flexbox" :class="transitionClass" :style="{transform: transformStyle}">

      <!-- 
        RENDERED ITEM
        Only 3 items will be rendered at a time (or 1 item if only 1 in array)
        renderedItems includes the previous, current, & next items
        It's important that each item has a stable key so Vue can track it
      -->
      <!-- <div v-for="item in renderedItems"  :key="item.key" class="rendered-item">

        <div class="item-content red" :style="{background:item.id.color}">
          {{item.id.title}}
        </div>
      </div> -->
      <slot/>

    </div>

    <!--
      LEFT & RIGHT TOUCH AREAS
      Non-visible divs over left & right sides of screen that can be tapped to change slide
    -->
    <div class="touch-tap-left" role="button" aria-label="Previous" tabindex="0" @click="previous"
      @keyup.enter="previous" @keyup.space="previous">

      <!--   
        LEFT EDGE SHAPE
        Edge animation when reaching end of array, otherwise loops infinitely (optional)
      -->
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 10 100" height="100%" width="40px"
        preserveAspectRatio="none" class="left-edge-shape" :class="transitionClass"
        :style="{transform: 'scaleX(' + leftEdgeScale + ')'}">
        <path d="M0,0v100h5.2c3-14.1,4.8-31.4,4.8-50S8.2,14.1,5.2,0H0z" />
      </svg>

    </div>

    <div class="touch-tap-right" role="button" aria-label="Next" tabindex="0" @click="next" @keyup.enter="next"
      @keyup.space="next">

      <!-- RIGHT EDGE SHAPE-->
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 10 100" height="100%" width="40px"
        preserveAspectRatio="none" class="right-edge-shape" :class="transitionClass"
        :style="{transform: 'scaleX(' + rightEdgeScale + ')'}">
        <path d="M10,100V0L4.8,0C1.8,14.1,0,31.4,0,50c0,18.6,1.8,35.9,4.8,50H10z" />
      </svg>

    </div>
  </div>
  
</template>

<style lang="scss" scoped>

.notransition {
  -webkit-transition: none !important;
  -moz-transition: none !important;
  -o-transition: none !important;
  transition: none !important;
}

#touch-container {
  position: relative;
  min-width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
}

#rendered-items-flexbox {
  display: flex;
  justify-content: center;
  height: 100vh;
  min-height: fit-content;
  width: 100vw;
  box-sizing: border-box;

  touch-action: pan-y!important; // Disables automatic browser control of touches, except vertical scrolling
}

// Removes all translation effects for those who prefer less animation
@media (prefers-reduced-motion: reduce) {
  #rendered-items-flexbox {
    transform: none !important;
  }
}

// Transition classes
.transition-initial {
  transition: transform 0s ease,
}

.transition-item {
  transition: transform 250ms cubic-bezier(0.0, 0.0, 0.2, 1); // ease-out timing function
}

.transition-edge {
  transition: transform 500ms ease-out;
}
 
.rendered-item {
  height: 100%;
  min-height: 500px;
  min-width: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 0 25px;
}

.item-content {
  min-height: 500px;
  height: 100%;
  width: 100vw;
  margin: 0 auto;
  box-sizing: border-box;
}


// Left and right tap targets
.touch-tap-left,
.touch-tap-right {
  position: absolute;
  top: 0;
  width: 10%;
  height: 100%;
}

.touch-tap-left {
  left: 0;
}

.touch-tap-right {
  right: 0;
}


// This is good for accessibility, so instead use polyfill for :focus-visible
// https://github.com/WICG/focus-visible
.touch-tap-left:focus, .touch-tap-right:focus {
  outline: none;
}

.left-edge-shape, .right-edge-shape {
  position: absolute;
  fill: var(--md-theme-default-accent);
  opacity: 0.3;
}

.left-edge-shape {
  left: 0;
  transform-origin: left;
}

.right-edge-shape {
  right: 0;
  transform-origin: right;
}



.red {
  background: rgb(255,6,25);
  background: linear-gradient(145deg, rgba(255,6,25,1) 40%, rgba(255,4,159,1) 100%);
}

.orange {
  background: rgb(255,100,6);
  background: linear-gradient(145deg, rgba(255,100,6,1) 40%, rgba(255,183,4,1) 100%);
}

.yellow {
  background: rgb(255,241,0);
  background: linear-gradient(145deg, rgba(255,241,0,1) 40%, rgba(239,255,6,1) 100%);
}

.green {
  background: rgb(1,159,127);
  background: linear-gradient(145deg, rgba(1,159,127,1) 40%, rgba(161,230,0,1) 100%);
}

.blue {
  background: rgb(34,29,233);
  background: linear-gradient(145deg, rgba(34,29,233,1) 40%, rgba(0,206,230,1) 100%);
}

.purple {
 background: rgb(114,27,250);
 background: linear-gradient(145deg, rgba(114,27,250,1) 40%, rgba(171,84,250,1) 100%);
}

</style>
