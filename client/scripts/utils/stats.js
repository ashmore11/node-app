const stats = function stats(el, mode, top, left) {

  this.stats = new Stats();

  this.setMode(0 || mode);

  this.setPosition(0 || top, 0 || left);

  const $el = el || $(document);

  $el.append(this.stats.domElement);

};

stats.prototype.setMode = function setMode(mode) {

  this.stats.setMode(mode);

};

stats.prototype.setPosition = function setPosition(top, left) {

  this.stats.domElement.style.position = 'absolute';
  this.stats.domElement.style.left     = `${left}px`;
  this.stats.domElement.style.top      = `${top}px`;

};

stats.prototype.begin = function begin() {

  this.stats.begin();

};

stats.prototype.end = function end() {

  this.stats.end();

};

export default stats;