export class SlimScrollOptions {
  // width in pixels of the visible scroll area
  width: string = 'auto';
  // height in pixels of the visible scroll area
  height: string = '250px';
  // width in pixels of the scrollbar and rail
  size: string = '7px';
  // scrollbar color; accepts any hex/color value
  color: string = '#000';
  // scrollbar position - left/right
  position: string = 'right';
  // distance in pixels between the side edge and the scrollbar
  distance: string = '1px';
  // default scroll position on load - top / bottom / $('selector')
  start: string = 'top';
  // sets scrollbar opacity
  opacity: number = .4;
  // enables always-on mode for the scrollbar
  alwaysVisible: boolean = false;
  // check if we should hide the scrollbar when user is hovering over
  disableFadeOut: boolean = false;
  // sets visibility of the rail
  railVisible: boolean = false;
  // sets rail color
  railColor: string = '#333';
  // sets rail opacity
  railOpacity: number = .2;
  // whether  we should use jQuery UI Draggable to enable bar dragging
  railDraggable: boolean = true;
  // defautlt CSS class of the slimscroll rail
  railClass: string = 'slimScrollRail';
  // defautlt CSS class of the slimscroll bar
  barClass: string = 'slimScrollBar';
  // defautlt CSS class of the slimscroll wrapper
  wrapperClass: string = 'slimScrollDiv';
  // check if mousewheel should scroll the window if we reach top/bottom
  allowPageScroll: boolean = false;
  // scroll amount applied to each mouse wheel step
  wheelStep: number = 20;
  // scroll amount applied when user is using gestures
  touchScrollStep: number = 200;
  // sets border radius
  borderRadius: string = '7px';
  // sets border radius of the rail
  railBorderRadius: string = '7px'
}
