export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const commandQueue: Command[] = [];
const queueDisplay = document.querySelector<HTMLOListElement>(
  "#rover-pending",
)!;
const queueStatus = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;

type Direction = {
  name: string;
  dx: number;
  dy: number;
};

const directions: Direction[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

function moveForward() {
  const current = directions[direction];

  x = Math.max(0, Math.min(4, x + current.dx));
  y = Math.max(0, Math.min(4, y + current.dy));

  drawRover();
}

function renderQueue() {
  queueDisplay.replaceChildren();

  for (const command of commandQueue) {
    const item = document.createElement("li");
    item.textContent = command.label;
    queueDisplay.appendChild(item);
  }

  queueStatus.textContent = commandQueue.length === 0
    ? "Empty · no pending commands"
    : `${commandQueue.length} command(s) pending`;

  document.querySelector<HTMLButtonElement>("#rover-run")!.disabled =
    commandQueue.length === 0;

  document.querySelector<HTMLButtonElement>("#rover-clear")!.disabled =
    commandQueue.length === 0;
}

function enqueueCommand(command: Command) {
  commandQueue.push(command);
  renderQueue();
}

let x = 2;
let y = 2;
let direction = 0;

type Command = {
  label: "Forward" | "Right";
  execute: () => void;
};

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }

  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[direction].name
  }`;
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  enqueueCommand({
    label: "Forward",
    execute: moveForward,
  });
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  enqueueCommand({
    label: "Right",
    execute: () => {
      direction = (direction + 1) % 4;
      drawRover();
    },
  });
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  commandQueue.length = 0;

  renderQueue();
  drawRover();
};
document.querySelector<HTMLButtonElement>("#rover-run")!.onclick = () => {
  while (commandQueue.length > 0) {
    const command = commandQueue.shift()!;
    command.execute();
  }
  renderQueue();
};
document.querySelector<HTMLButtonElement>("#rover-clear")!.onclick = () => {
  commandQueue.length = 0;
  renderQueue();
};
drawRover();
