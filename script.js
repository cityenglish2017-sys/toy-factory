const newOrderBtn = document.getElementById("newOrderBtn");
const orderCard = document.getElementById("orderCard");
const toyPreview = document.getElementById("toyPreview");
const buildStatus = document.getElementById("buildStatus");
const partsButtons = document.getElementById("partsButtons");
const progressFill = document.getElementById("progressFill");
const inspectBtn = document.getElementById("inspectBtn");
const packBtn = document.getElementById("packBtn");
const shipBtn = document.getElementById("shipBtn");
const message = document.getElementById("message");
const scoreSpan = document.getElementById("score");

let currentOrder = null;
let assembledParts = [];
let inspected = false;
let packed = false;
let score = 0;

const orders = [
  {
    type: "car",
    name: "국산 SUV 장난감",
    model: "Family SUV",
    color: "#1e88e5",
    request: "파란색 국산 SUV를 만들어주세요!",
    parts: ["플랫폼", "차체", "바퀴", "창문", "라이트"]
  },
  {
    type: "car",
    name: "국산 세단 장난감",
    model: "City Sedan",
    color: "#e53935",
    request: "빨간색 국산 세단을 만들어주세요!",
    parts: ["플랫폼", "차체", "바퀴", "창문", "라이트"]
  },
  {
    type: "car",
    name: "국산 경찰차 장난감",
    model: "Police Car",
    color: "#ffffff",
    request: "경찰차 장난감을 만들어주세요!",
    parts: ["플랫폼", "차체", "바퀴", "사이렌", "스티커"]
  },
  {
    type: "car",
    name: "국산 버스 장난감",
    model: "City Bus",
    color: "#ffca28",
    request: "노란색 버스 장난감을 만들어주세요!",
    parts: ["플랫폼", "차체", "바퀴", "창문", "문"]
  },
  {
    type: "doll",
    name: "말하는 아기 인형",
    model: "Talking Baby",
    request: "말하는 아기 인형을 만들어주세요!",
    emoji: "👶",
    parts: ["얼굴", "몸통", "팔", "다리", "옷"]
  },
  {
    type: "doll",
    name: "공주 인형",
    model: "Princess Doll",
    request: "반짝이는 공주 인형을 만들어주세요!",
    emoji: "👸",
    parts: ["얼굴", "머리", "드레스", "신발", "왕관"]
  },
  {
    type: "doll",
    name: "동물 친구 인형",
    model: "Animal Friend",
    request: "귀여운 동물 친구 인형을 만들어주세요!",
    emoji: "🐻",
    parts: ["얼굴", "몸통", "귀", "팔", "리본"]
  }
];

const partIcons = {
  "플랫폼": "🧱",
  "차체": "🚗",
  "바퀴": "⚙️",
  "창문": "🪟",
  "라이트": "💡",
  "사이렌": "🚨",
  "스티커": "⭐",
  "문": "🚪",
  "얼굴": "😊",
  "몸통": "🧸",
  "팔": "💪",
  "다리": "🦵",
  "옷": "👕",
  "머리": "💇",
  "드레스": "👗",
  "신발": "👟",
  "왕관": "👑",
  "귀": "👂",
  "리본": "🎀"
};

newOrderBtn.addEventListener("click", makeNewOrder);
inspectBtn.addEventListener("click", inspectToy);
packBtn.addEventListener("click", packToy);
shipBtn.addEventListener("click", shipToy);

function makeNewOrder() {
  currentOrder = orders[Math.floor(Math.random() * orders.length)];
  assembledParts = [];
  inspected = false;
  packed = false;

  orderCard.textContent =
    `주문서\n\n${currentOrder.request}\n\n제품: ${currentOrder.name}`;

  buildStatus.textContent = "부품을 하나씩 눌러 조립하세요!";
  message.textContent = "부품 창고에서 필요한 부품을 눌러주세요.";
  progressFill.style.width = "0%";

  drawPreview(false);
  makePartButtons();
}

function makePartButtons() {
  partsButtons.innerHTML = "";

  currentOrder.parts.forEach(part => {
    const btn = document.createElement("button");
    btn.className = "partBtn";
    btn.innerHTML = `${partIcons[part] || "🔧"}<br>${part}`;
    btn.addEventListener("click", () => assemblePart(part, btn));
    partsButtons.appendChild(btn);
  });
}

function assemblePart(part, btn) {
  if (!currentOrder) {
    message.textContent = "먼저 주문을 받아주세요!";
    return;
  }

  if (assembledParts.includes(part)) {
    message.textContent = `${part} 부품은 이미 조립했어요.`;
    return;
  }

  assembledParts.push(part);
  btn.classList.add("done");

  const percent = Math.round((assembledParts.length / currentOrder.parts.length) * 100);
  progressFill.style.width = percent + "%";

  buildStatus.textContent = `${part} 조립 완료! (${assembledParts.length}/${currentOrder.parts.length})`;

  if (assembledParts.length === currentOrder.parts.length) {
    drawPreview(true);
    message.textContent = "조립 완료! 이제 검사 버튼을 눌러주세요.";
  } else {
    message.textContent = "좋아요! 다음 부품도 조립해주세요.";
  }
}

function drawPreview(complete) {
  toyPreview.innerHTML = "";

  if (!currentOrder) {
    toyPreview.textContent = "❓";
    return;
  }

  if (currentOrder.type === "car") {
    const car = document.createElement("div");
    car.className = "carToy";
    car.style.setProperty("--car-color", currentOrder.color);

    const w1 = document.createElement("div");
    w1.className = "wheel left";
    const w2 = document.createElement("div");
    w2.className = "wheel right";

    car.appendChild(w1);
    car.appendChild(w2);

    if (!complete) {
      car.style.opacity = "0.45";
    }

    toyPreview.appendChild(car);
  } else {
    const doll = document.createElement("div");
    doll.className = "dollToy";
    doll.textContent = currentOrder.emoji;

    if (!complete) {
      doll.style.opacity = "0.45";
    }

    toyPreview.appendChild(doll);
  }
}

function inspectToy() {
  if (!currentOrder) {
    message.textContent = "먼저 주문을 받아주세요!";
    return;
  }

  if (assembledParts.length !== currentOrder.parts.length) {
    message.textContent = "아직 조립이 끝나지 않았어요!";
    return;
  }

  inspected = true;
  message.textContent = "🔍 검사 완료! 장난감이 아주 잘 만들어졌어요.";
}

function packToy() {
  if (!inspected) {
    message.textContent = "먼저 검사를 해야 포장할 수 있어요!";
    return;
  }

  packed = true;
  toyPreview.innerHTML = "🎁";
  message.textContent = "🎁 포장 완료! 이제 출고할 수 있어요.";
}

function shipToy() {
  if (!packed) {
    message.textContent = "먼저 장난감을 포장해주세요!";
    return;
  }

  score++;
  scoreSpan.textContent = score;

  message.textContent = `🚚 출고 완료! ${currentOrder.name} 배송 성공!`;
  orderCard.textContent = "새 주문을 받아주세요!";
  toyPreview.textContent = "✅";
  buildStatus.textContent = "완성!";
  partsButtons.innerHTML = "";
  progressFill.style.width = "100%";

  currentOrder = null;
}