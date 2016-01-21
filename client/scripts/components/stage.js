const Stage = new PIXI.Container();

Stage.getObjectById = function getObjectById(id) {

  return Stage.children.filter(child => {

    if (child._id === id) return child;

  })[0];

};

export default Stage;
