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
    color: "#1e88e5",
    request: "파란색 국산 SUV를 만들어주세요!",
    parts: ["플랫폼", "차체", "바퀴", "창문", "라이트"]
  },
  {
    type: "car",
    name: "국산 세단 장난감",
    color: "#e53935",
    request: "빨간색 국산 세단을 만들어주세요!",
    parts: ["플랫폼", "차체", "바퀴", "창문", "라이트"]
  },
  {
    type: "car",
    name: "국산 경찰차 장난감",
    color: "#ffffff",
    request: "경찰차 장난감을 만들어주세요!",
    parts: ["플랫폼", "차체", "바퀴", "사이렌", "스티커"]
  },
  {
    type: "car",
    name: "국산 버스 장난감",
    color: "#ffca28",
    request: "노란색 버스 장난감을 만들어주세요!",
    parts: ["플랫폼", "차체", "바퀴", "창문", "문"]
  },
  {
    type: "doll",
    name: "말하는 아기 인형",
    request: "말하는 아기 인형을 만들어주세요!",
    parts: ["얼굴", "몸통", "팔", "다리", "옷"]
  },
  {
    type: "doll",
    name: "공주 인형",
    request: "반짝이는 공주 인형을 만들어주세요!",
    parts: ["얼굴", "머리", "드레스", "신발", "왕관"]
  },
  {
    type: "doll",
    name: "동물 친구 인형",
    request: "귀여운 동물 친구 인형을 만들어주세요!",
    parts: ["얼굴", "몸통", "귀", "팔", "리본"]
  }
];

const allCarParts = ["플랫폼", "차체", "바퀴", "창문", "라이트", "사이렌", "스티커", "문", "날개", "프로펠러"];
const allDollParts = ["얼굴", "몸통", "팔", "다리", "옷", "머리", "드레스", "신발", "왕관", "귀", "리본", "바퀴", "사이렌"];

const partIcons = {
  "플랫폼": "🧱",
  "차체": "🚗",
  "바퀴": "⚙️",
  "창문": "🪟",
  "라이트": "💡",
  "사이렌": "🚨",
  "스티커": "⭐",
  "문": "🚪",
  "날개": "🪽",
  "프로펠러": "🌀",
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
    `주문서\n\n${currentOrder.request}\n\n필요 부품 ${currentOrder.parts.length}개`;

  buildStatus.textContent = "부품 창고에는 필요 없는 부품도 있어요. 잘 골라주세요!";
  message.textContent = "주문서를 보고 필요한 부품만 골라 조립하세요.";
  progressFill.style.width = "0%";

  drawPreview();
  makeMixedPartButtons();
}

function makeMixedPartButtons() {
  partsButtons.innerHTML = "";

  const pool = currentOrder.type === "car" ? allCarParts : allDollParts;
  const wrongParts = pool.filter(part => !currentOrder.parts.includes(part));

  const mixed = [...currentOrder.parts];

  while (mixed.length < 8 && wrongParts.length > 0) {
    const randomWrong = wrongParts.splice(Math.floor(Math.random() * wrongParts.length), 1)[0];
    mixed.push(randomWrong);
  }

  shuffle(mixed).forEach(part => {
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

  if (!currentOrder.parts.includes(part)) {
    message.textContent = `❌ ${part}은/는 이번 주문에 필요 없는 부품이에요!`;
    btn.classList.add("wrong");
    setTimeout(() => btn.classList.remove("wrong"), 400);
    return;
  }

  if (assembledParts.includes(part)) {
    message.textContent = `${part} 부품은 이미 조립했어요.`;
    return;
  }

  assembledParts.push(part);
  btn.classList.add("done");

  turnOnPart(part);

  const percent = Math.round((assembledParts.length / currentOrder.parts.length) * 100);
  progressFill.style.width = percent + "%";

  buildStatus.textContent = `${part} 조립 완료! (${assembledParts.length}/${currentOrder.parts.length})`;

  if (assembledParts.length === currentOrder.parts.length) {
    message.textContent = "조립 완료! 이제 검사 버튼을 눌러주세요.";
  } else {
    message.textContent = "좋아요! 장난감에 부품이 붙었어요. 다음 부품을 골라주세요.";
  }
}

function drawPreview() {
  toyPreview.innerHTML = "";

  if (!currentOrder) {
    toyPreview.textContent = "❓";
    return;
  }

  if (currentOrder.type === "car") {
    const stage = document.createElement("div");
    stage.className = "carStage";
    stage.style.setProperty("--car-color", currentOrder.color);

    stage.innerHTML = `
      <div class="carPart carPlatform" data-part="플랫폼"></div>
      <div class="carPart carBody" data-part="차체"></div>
      <div class="carPart carWindow" data-part="창문"></div>
      <div class="carPart carWheel left" data-part="바퀴"></div>
      <div class="carPart carWheel right" data-part="바퀴"></div>
      <div class="carPart carLight" data-part="라이트"></div>
      <div class="carPart carSiren" data-part="사이렌"></div>
      <div class="carPart carSticker" data-part="스티커">⭐</div>
      <div class="carPart carDoor" data-part="문"></div>
    `;

    toyPreview.appendChild(stage);
  } else {
    const stage = document.createElement("div");
    stage.className = "dollStage";

    stage.innerHTML = `
      <div class="dollPart dollHair" data-part="머리">💇</div>
      <div class="dollPart dollCrown" data-part="왕관">👑</div>
      <div class="dollPart dollFace" data-part="얼굴">😊</div>
      <div class="dollPart dollEar" data-part="귀">👂</div>
      <div class="dollPart dollRibbon" data-part="리본">🎀</div>
      <div class="dollPart dollBody" data-part="몸통">🧸</div>
      <div class="dollPart dollArm" data-part="팔">💪</div>
      <div class="dollPart dollLeg" data-part="다리">🦵</div>
      <div class="dollPart dollDress" data-part="드레스">👗</div>
      <div class="dollPart dollShoes" data-part="신발">👟</div>
      <div class="dollPart dollDress" data-part="옷">👕</div>
    `;

    toyPreview.appendChild(stage);
  }
}

function turnOnPart(part) {
  const parts = toyPreview.querySelectorAll(`[data-part="${part}"]`);
  parts.forEach(p => p.classList.add("on"));
}

function inspectToy() {
  if (!currentOrder) {
    message.textContent = "먼저 주문을 받아주세요!";
    return;
  }

  if (assembledParts.length !== currentOrder.parts.length) {
    message.textContent = "아직 필요한 부품이 다 조립되지 않았어요!";
    return;
  }

  inspected = true;
  message.textContent = "🔍 검사 완료! 주문서와 부품이 정확히 맞아요.";
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

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
