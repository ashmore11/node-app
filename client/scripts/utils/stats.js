const STATS = {

  stats: new Stats(),

};

STATS.init = function init(el, mode, top, left) {

  this.setMode(0 || mode);

  this.setPosition(0 || top, 0 || left);

  const $el = el || $(document);

  $el.append(this.stats.domElement);

};

STATS.setMode = function setMode(mode) {

  this.stats.setMode(mode);

};

STATS.setPosition = function setPosition(top, left) {

  this.stats.domElement.style.position = 'absolute';
  this.stats.domElement.style.left = `${left}px`;
  this.stats.domElement.style.top = `${top}px`;

};

STATS.begin = function begin() {

  this.stats.begin();

};

STATS.end = function end() {

  this.stats.end();

};

export default STATS;
