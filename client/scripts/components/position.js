import Renderer from 'app/components/renderer';
import Controls from 'app/components/controls';

export default function Position(player) {

  const speed = 7.5;

  let x = player.x;
  let y = player.y;

  if (Controls.left) x -= speed;
  if (Controls.up) y -= speed;
  if (Controls.right) x += speed;
  if (Controls.down) y += speed;

  if (x < 20) x = 20;
  if (y < 20) y = 20;

  if (x > Renderer.width - 20) x = Renderer.width - 20;
  if (y > Renderer.height - 20) y = Renderer.height - 20;

  const pos = { x, y };

  return pos;

}
