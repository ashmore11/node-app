export default function Position(player, controls, renderer) {

  const speed = 7.5;

  let x = player.x;
  let y = player.y;

  if(controls.left)  x -= speed;
  if(controls.up)    y -= speed;
  if(controls.right) x += speed;
  if(controls.down)  y += speed;

  if(x < 20) x = 20;
  if(y < 20) y = 20;
  
  if(x > renderer.width  - 20) x = renderer.width  - 20;
  if(y > renderer.height - 20) y = renderer.height - 20;

  const pos = {
    x: x,
    y: y,
  };

  return pos;

};