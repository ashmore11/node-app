const Stage = new PIXI.Container();

Stage.getChildById = function getChildById(id) {

  return Stage.children.filter(child => {

    if (child.id === id) return child;

  })[0];

};

export default Stage;
