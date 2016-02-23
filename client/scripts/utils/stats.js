const STATS = {

  stats: new Stats(),

  init: function init(el, mode, top, left) {

    this.setMode(0 || mode);

    this.setPosition(0 || top, 0 || left);

    const $el = el || $(document);

    $el.append(this.stats.domElement);

  },

  setMode: function setMode(mode) {

    this.stats.setMode(mode);

  },

  setPosition: function setPosition(top, left) {

    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = `${left}px`;
    this.stats.domElement.style.top = `${top}px`;

  },

  begin: function begin() {

    this.stats.begin();

  },

  end: function end() {

    this.stats.end();

  },

};

export default STATS;
