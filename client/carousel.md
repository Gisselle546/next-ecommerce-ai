# Simple Carousel Tutorial - 50/50 Split with Slide-Up Animation

## What We're Building

A carousel with **2 images side-by-side** (50% each) that automatically changes every second. When images change, they **slide up and disappear** while **new images slide in from the bottom**.

**Visual:**
```
┌──────────────┬──────────────┐
│   Image 1    │   Image 2    │  ← Current images
│     50%      │     50%      │
└──────────────┴──────────────┘

After 1 second (Animation):
↑ Old images slide UP and disappear
↓ New images slide IN from bottom

┌──────────────┬──────────────┐
│   Image 3    │   Image 4    │  ← New images
│     50%      │     50%      │
└──────────────┴──────────────┘
```

---

## Step 1: Understanding the Container

Think of it like a **picture frame** with two slots:

```tsx
<div className="container">  {/* The frame */}
  <div className="left-slot">   {/* Left 50% */}
    {/* Left images go here */}
  </div>
  <div className="right-slot">  {/* Right 50% */}
    {/* Right images go here */}
  </div>
</div>
```

**CSS for the frame:**
```css
.container {
  display: flex;           /* Put children side-by-side */
  width: 100%;            /* Full width */
  height: 100vh;          /* Full screen height */
}

.left-slot {
  width: 50%;             /* Take half the space */
}

.right-slot {
  width: 50%;             /* Take other half */
}
```

---

## Step 2: Understanding Image Stacking

Inside each slot, we **stack ALL images on top of each other** using `position: absolute`:

```
Imagine a deck of cards stacked:

     [Image 3] ← Top (hidden)
     [Image 2] ← Middle (hidden)
     [Image 1] ← Bottom (visible)
```

**Only ONE image is visible at a time** (the rest are hidden or positioned off-screen).

**Code:**
```tsx
<div className="left-slot relative">  {/* relative = positioning context */}
  <img 
    src="/image-1.jpg" 
    className="absolute inset-0"  {/* Stack on top of each other */}
  />
  <img 
    src="/image-2.jpg" 
    className="absolute inset-0"
  />
  <img 
    src="/image-3.jpg" 
    className="absolute inset-0"
  />
</div>
```

**CSS Explanation:**
```css
.relative {
  position: relative;  /* Creates boundary for absolute children */
}

.absolute {
  position: absolute;  /* Remove from normal flow, stack on top */
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* Makes image fill the entire parent */
}
```

---

## Step 3: The Slide-Up Animation

When we change images, we want:
1. **Current image** slides UP and disappears (translateY goes from 0 to -100%)
2. **New image** slides IN from bottom (translateY goes from 100% to 0)

**Visual Timeline:**
```
Start (t=0):
┌─────────┐
│ Image 1 │ ← translateY: 0% (visible)
└─────────┘
    ↑
┌─────────┐
│ Image 2 │ ← translateY: 100% (below viewport, hidden)
└─────────┘

During Animation (t=0.5s):
    ↑ Moving up
┌─────────┐
│ Image 1 │ ← translateY: -50% (half gone)
└─────────┘
    ↑
┌─────────┐
│ Image 2 │ ← translateY: 50% (half visible)
└─────────┘

End (t=1s):
    ↑ Gone!
┌─────────┐
│ Image 1 │ ← translateY: -100% (above viewport, hidden)
└─────────┘

┌─────────┐
│ Image 2 │ ← translateY: 0% (fully visible)
└─────────┘
```

**CSS Classes:**
```css
/* Image starting position (visible) */
.translate-y-0 {
  transform: translateY(0%);
}

/* Image exiting position (slides up) */
.translate-y-[-100%] {
  transform: translateY(-100%);  /* Move up by full height */
}

/* Image entering position (starts below) */
.translate-y-full {
  transform: translateY(100%);   /* Start below viewport */
}

/* Smooth animation */
.transition-transform {
  transition: transform 1s ease-in-out;
}
```

---

## Step 4: JavaScript Logic - The Brain

We use **state** to track which image should be shown:

```tsx
const [currentIndex, setCurrentIndex] = useState(0);
```

**What is state?**
- It's a variable that React watches
- When it changes, React re-renders the component
- This triggers our animations

**Example:**
```
currentIndex = 0  →  Show images[0]
currentIndex = 1  →  Show images[1]
currentIndex = 2  →  Show images[2]
```

### The Timer (useEffect)

We use `setInterval` to automatically increment the index every second:

```tsx
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, 1000);  // Run every 1000ms (1 second)

  return () => clearInterval(timer);  // Cleanup when component unmounts
}, []);
```

**Breaking it down:**

```tsx
setInterval(() => {
  // This function runs every 1 second
  setCurrentIndex((prev) => (prev + 1) % images.length);
}, 1000);
```

**What does `(prev + 1) % images.length` mean?**

Let's say we have 4 images (length = 4):

```
Step 1: prev = 0  →  (0 + 1) % 4 = 1
Step 2: prev = 1  →  (1 + 1) % 4 = 2
Step 3: prev = 2  →  (2 + 1) % 4 = 3
Step 4: prev = 3  →  (3 + 1) % 4 = 0  ← Wraps back to start!
Step 5: prev = 0  →  (0 + 1) % 4 = 1  ← Loops forever
```

The `%` (modulo) operator makes it **loop back to 0** after reaching the end.

---

## Step 5: Determining Which Image to Show

For each image, we need to know:
1. Is it the **current** image (visible)?
2. Is it the **previous** image (sliding out)?
3. Is it a **future** image (waiting)?

```tsx
images.map((image, index) => {
  const isCurrent = index === currentIndex;
  const isPrevious = index === (currentIndex - 1 + images.length) % images.length;

  // Determine CSS classes
  let positionClass = '';
  if (isCurrent) {
    positionClass = 'translate-y-0';      // Visible in center
  } else if (isPrevious) {
    positionClass = '-translate-y-full';  // Slide up (exiting)
  } else {
    positionClass = 'translate-y-full';   // Wait below (not visible)
  }

  return (
    <img
      key={index}
      src={image}
      className={`absolute inset-0 transition-transform duration-1000 ${positionClass}`}
    />
  );
})
```

**Visual State Machine:**

```
Image States:

Future Images (waiting):
  translateY: 100%     ← Below viewport
  
Current Image (visible):
  translateY: 0%       ← Center of viewport
  
Previous Image (exiting):
  translateY: -100%    ← Above viewport (sliding out)
```

---

## Complete Working Example

```tsx
'use client';

import { useState, useEffect } from 'react';

// Our image arrays
const leftImages = [
  '/carousel/left-1.jpg',
  '/carousel/left-2.jpg',
  '/carousel/left-3.jpg',
  '/carousel/left-4.jpg',
];

const rightImages = [
  '/carousel/right-1.jpg',
  '/carousel/right-2.jpg',
  '/carousel/right-3.jpg',
  '/carousel/right-4.jpg',
];

export function SimpleCarousel() {
  // Track which image is currently showing
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance every 1 second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % leftImages.length);
    }, 1000);

    // Cleanup: stop timer when component unmounts
    return () => clearInterval(timer);
  }, []);

  // Calculate previous index (for slide-out animation)
  const previousIndex = (currentIndex - 1 + leftImages.length) % leftImages.length;

  return (
    <div className="flex w-full h-screen">
      {/* LEFT SIDE - 50% */}
      <div className="relative w-1/2 h-full overflow-hidden">
        {leftImages.map((image, index) => {
          // Determine this image's state
          const isCurrent = index === currentIndex;
          const isPrevious = index === previousIndex;

          // Set position based on state
          let positionClass = 'translate-y-full';  // Default: below viewport

          if (isCurrent) {
            positionClass = 'translate-y-0';       // Current: visible
          } else if (isPrevious) {
            positionClass = '-translate-y-full';   // Previous: slide up
          }

          return (
            <img
              key={index}
              src={image}
              alt={`Left ${index + 1}`}
              className={`
                absolute inset-0 w-full h-full object-cover
                transition-transform duration-1000 ease-in-out
                ${positionClass}
              `}
            />
          );
        })}
      </div>

      {/* RIGHT SIDE - 50% */}
      <div className="relative w-1/2 h-full overflow-hidden">
        {rightImages.map((image, index) => {
          const isCurrent = index === currentIndex;
          const isPrevious = index === previousIndex;

          let positionClass = 'translate-y-full';

          if (isCurrent) {
            positionClass = 'translate-y-0';
          } else if (isPrevious) {
            positionClass = '-translate-y-full';
          }

          return (
            <img
              key={index}
              src={image}
              alt={`Right ${index + 1}`}
              className={`
                absolute inset-0 w-full h-full object-cover
                transition-transform duration-1000 ease-in-out
                ${positionClass}
              `}
            />
          );
        })}
      </div>
    </div>
  );
}
```

---

## How It Works - Frame by Frame

### Initial State (t=0s)
```
currentIndex = 0

Left Side:                Right Side:
┌───────────┐            ┌───────────┐
│ Image 0   │ ← visible  │ Image 0   │ ← visible
│ (y: 0%)   │            │ (y: 0%)   │
└───────────┘            └───────────┘
     ↑                        ↑
┌───────────┐            ┌───────────┐
│ Image 1   │ ← hidden   │ Image 1   │ ← hidden
│ (y: 100%) │            │ (y: 100%) │
└───────────┘            └───────────┘
```

### After 1 Second (t=1s)
```
currentIndex changes: 0 → 1
previousIndex = 0

Left Side Animation:      Right Side Animation:
Image 0: y: 0% → -100%    Image 0: y: 0% → -100%  (slides UP)
Image 1: y: 100% → 0%     Image 1: y: 100% → 0%   (slides IN)

    ↑ Sliding out
┌───────────┐            ┌───────────┐
│ Image 0   │            │ Image 0   │
│ (y:-100%) │            │ (y:-100%) │
└───────────┘            └───────────┘

┌───────────┐            ┌───────────┐
│ Image 1   │ ← visible  │ Image 1   │ ← visible
│ (y: 0%)   │            │ (y: 0%)   │
└───────────┘            └───────────┘
     ↑                        ↑
┌───────────┐            ┌───────────┐
│ Image 2   │ ← waiting  │ Image 2   │ ← waiting
│ (y: 100%) │            │ (y: 100%) │
└───────────┘            └───────────┘
```

### After 2 Seconds (t=2s)
```
currentIndex changes: 1 → 2
previousIndex = 1

Same animation repeats:
- Image 1 slides UP (becomes previous)
- Image 2 slides IN (becomes current)
```

---

## Key Concepts Explained Simply

### 1. Why `position: absolute`?

```tsx
// WITHOUT absolute (images stack vertically - BAD)
<div>
  <img src="/1.jpg" />  ← Image 1
  <img src="/2.jpg" />  ← Image 2 below Image 1
  <img src="/3.jpg" />  ← Image 3 below Image 2
</div>

// WITH absolute (images stack on TOP of each other - GOOD)
<div className="relative">
  <img className="absolute inset-0" src="/1.jpg" />  ← All at same position
  <img className="absolute inset-0" src="/2.jpg" />  ← Overlapping
  <img className="absolute inset-0" src="/3.jpg" />  ← Like a deck of cards
</div>
```

### 2. Why `overflow-hidden`?

Without it, you'd see the images that are positioned below (`translateY(100%)`):

```
WITHOUT overflow-hidden:
┌─────────────┐
│ Visible     │ ← Viewport
│ Image       │
└─────────────┘
│ Waiting     │ ← VISIBLE! (we don't want this)
│ Image       │
└─────────────┘

WITH overflow-hidden:
┌─────────────┐
│ Visible     │ ← Viewport
│ Image       │
└─────────────┘
  Hidden area
```

### 3. Why `transition-transform duration-1000`?

This tells the browser: **"When translateY changes, animate smoothly over 1 second"**

```css
/* Without transition (instant jump - ugly) */
.no-transition {
  transform: translateY(0%);
}
/* User clicks... */
.no-transition {
  transform: translateY(-100%);  /* JUMPS instantly */
}

/* With transition (smooth slide - beautiful) */
.with-transition {
  transform: translateY(0%);
  transition: transform 1s;
}
/* User clicks... */
.with-transition {
  transform: translateY(-100%);  /* SMOOTHLY slides over 1 second */
}
```

---

## Customization Examples

### Change Speed

```tsx
// Faster (every 500ms = 0.5 seconds)
setInterval(() => {
  setCurrentIndex((prev) => (prev + 1) % images.length);
}, 500);

// Slower (every 3000ms = 3 seconds)
setInterval(() => {
  setCurrentIndex((prev) => (prev + 1) % images.length);
}, 3000);
```

### Change Animation Duration

```tsx
// Faster animation (0.5 seconds)
className="transition-transform duration-500"

// Slower animation (2 seconds)
className="transition-transform duration-2000"
```

### Slide Down Instead of Up

```tsx
// Current image slides DOWN (instead of up)
const positionClass = isPrevious ? 'translate-y-full' : '-translate-y-full';

// New image enters from TOP (instead of bottom)
const positionClass = isCurrent ? 'translate-y-0' : '-translate-y-full';
```

### Different Ratios (60/40 instead of 50/50)

```tsx
<div className="flex w-full h-screen">
  <div className="relative w-[60%]">  {/* Left: 60% */}
    {/* Left images */}
  </div>
  <div className="relative w-[40%]">  {/* Right: 40% */}
    {/* Right images */}
  </div>
</div>
```

### Add Pause on Hover

```tsx
const [isPaused, setIsPaused] = useState(false);

useEffect(() => {
  if (isPaused) return;  // Don't run timer if paused

  const timer = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, 1000);

  return () => clearInterval(timer);
}, [isPaused]);

return (
  <div 
    onMouseEnter={() => setIsPaused(true)}
    onMouseLeave={() => setIsPaused(false)}
  >
    {/* Carousel */}
  </div>
);
```

---

## Troubleshooting

### Problem: Images jump instead of sliding

**Solution:** Make sure you have:
```tsx
className="transition-transform duration-1000"
```

### Problem: I see multiple images at once

**Solution:** Add `overflow-hidden` to parent:
```tsx
<div className="relative w-1/2 overflow-hidden">
```

### Problem: Images don't fill the container

**Solution:** Add these classes to images:
```tsx
className="absolute inset-0 w-full h-full object-cover"
```

### Problem: Animation is choppy

**Solution:** Use `will-change` for better performance:
```tsx
className="transition-transform duration-1000 will-change-transform"
```

### Problem: Carousel doesn't loop

**Solution:** Use modulo operator `%`:
```tsx
setCurrentIndex((prev) => (prev + 1) % images.length);
// Not: setCurrentIndex(prev + 1)  ← This doesn't loop!
```

---

## Quick Reference

### Essential CSS Classes

```tsx
// Container
className="relative overflow-hidden"  // Creates boundary, hides overflow

// Images
className="absolute inset-0 w-full h-full object-cover"  // Stack & fill

// Animation
className="transition-transform duration-1000 ease-in-out"  // Smooth slide

// Positions
className="translate-y-0"        // Visible (center)
className="-translate-y-full"    // Exit up
className="translate-y-full"     // Wait below
```

### State Management

```tsx
// Current image index
const [currentIndex, setCurrentIndex] = useState(0);

// Previous image index
const previousIndex = (currentIndex - 1 + images.length) % images.length;

// Check image state
const isCurrent = index === currentIndex;
const isPrevious = index === previousIndex;
```

### Timer Setup

```tsx
useEffect(() => {
  const timer = setInterval(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, 1000);  // Change every 1 second

  return () => clearInterval(timer);  // Cleanup
}, []);
```

---

## Summary

1. **Container**: Split screen 50/50 with `flex`
2. **Stacking**: Use `absolute` to stack images on top of each other
3. **State**: Track `currentIndex` to know which image to show
4. **Timer**: Use `setInterval` to auto-increment every second
5. **Animation**: Use `translateY` to slide images up/down
6. **Transitions**: Use `transition-transform` for smooth animation

**Key Formula:**
```
Current Image:  translateY(0%)      ← Visible
Previous Image: translateY(-100%)   ← Sliding out (up)
Future Images:  translateY(100%)    ← Waiting below
```

---

**Document Version:** 1.0  
**Last Updated:** January 9, 2026  
**Author:** GitHub Copilot  
**Project:** EcomRest E-commerce Platform
