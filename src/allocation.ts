export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;

let producers = 2;

type ShiftResults = {
  producers: number;
  production: number;
  consumption: number;
  balance: number;
};

function calculateShift(producers: number): ShiftResults {
  const production = producers * 3;
  const consumption = 6;
  const balance = production - consumption;

  return {
    producers,
    production,
    consumption,
    balance,
  };
}

type ResourceDisplay = {
  label: string;
  value: number;
  color: string;
};

function display() {
  const results = calculateShift(producers);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < results.producers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < results.producers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }

  const resources: ResourceDisplay[] = [
    {
      label: "Production",
      value: results.production,
      color: "#27766b",
    },
    {
      label: "Consumption",
      value: results.consumption,
      color: "#a44d23",
    },
  ];

  resources.forEach((resource, index) => {
    const labelY = 102 + index * 52;
    const barY = labelY + 8;

    ctx.fillStyle = "#233e43";
    ctx.fillText(
      `${resource.label}: ${resource.value}`,
      18,
      labelY,
    );

    ctx.fillStyle = resource.color;
    ctx.fillRect(
      18,
      barY,
      resource.value * 14,
      20,
    );
  });
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  producers = Math.max(0, producers - 1);
  display();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  producers = Math.min(6, producers + 1);
  display();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    producers = 2;
    display();
  };
display();
