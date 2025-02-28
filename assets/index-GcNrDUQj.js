var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _numbers, _Lotto_instances, validate_fn, checkType_fn, checkLength_fn, checkRange_fn, checkDuplicated_fn, _lottos, _LottoMachine_instances, generateLottos_fn, generateLotto_fn, validateLottoCount_fn, _winningNumbers, _bonusNumber, _WinningResult_instances, getMatchCount_fn;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const KEY = Object.freeze({
  PURCHASE_PRICE: "구입 금액",
  PURCHASE_COUNT: "로또 구매 개수",
  WINNING_NUMBERS: "당첨 번호",
  BONUS_NUMBER: "보너스 번호"
});
const PURCHASE_PRICE = Object.freeze({
  MIN: 1e3,
  MAX: 1e6,
  UNIT: 1e3
});
const LOTTO = Object.freeze({
  MIN_NUMBER: 1,
  MAX_NUMBER: 45,
  NUMBER_LENGTH: 6
});
const PROFIT = Object.freeze([5e3, 5e4, 15e5, 3e7, 2e9]);
const LOTTO_COUNT = Object.freeze(["3", "4", "5", "5", "6"]);
const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const ERROR_MESSAGE = Object.freeze({
  PURCHASE: {
    INVALID_UNIT: "구입 금액은 1,000원 단위로 입력해야 합니다."
  },
  BONUS_NUMBER: {
    DUPLICATE: "보너스 번호는 당첨 번호와 중복될 수 없습니다."
  },
  RESTART: {
    INVALID_INPUT: "y 또는 n을 입력해주세요."
  },
  LOTTO: {
    INVALID_TYPE: "로또 번호는 숫자여야 합니다.",
    INVALID_LENGTH: "로또 번호는 6개여야 합니다.",
    INVALID_RANGE: "로또 번호의 범위는 1~45 사이입니다.",
    DUPLICATE: "로또 번호는 중복되면 안됩니다."
  },
  COMMON: {
    INVALID_TYPE: (key) => `${key}은(는) 숫자여야 합니다.`,
    INVALID_RANGE: ({ key, min, max }) => `${key}은(는) ${min.toLocaleString()} 이상 ${max.toLocaleString()} 이하여야 합니다.`,
    INVALID_COUNT: (key) => `${key}은(는) 6개여야 합니다.`,
    DUPLICATE: (key) => `${key}은(는) 중복되면 안됩니다.`
  }
});
const validateType = (key, value) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(ERROR_MESSAGE.COMMON.INVALID_TYPE(key));
  }
};
const validateRange = ({ key, value, min, max }) => {
  if (value < min || value > max) {
    throw new Error(
      ERROR_MESSAGE.COMMON.INVALID_RANGE({
        key,
        min,
        max
      })
    );
  }
};
class Lotto {
  constructor(numbers) {
    __privateAdd(this, _Lotto_instances);
    __privateAdd(this, _numbers);
    __privateMethod(this, _Lotto_instances, validate_fn).call(this, numbers);
    __privateSet(this, _numbers, numbers);
  }
  get numbers() {
    return [...__privateGet(this, _numbers)];
  }
}
_numbers = new WeakMap();
_Lotto_instances = new WeakSet();
validate_fn = function(numbers) {
  __privateMethod(this, _Lotto_instances, checkType_fn).call(this, numbers);
  __privateMethod(this, _Lotto_instances, checkLength_fn).call(this, numbers);
  __privateMethod(this, _Lotto_instances, checkRange_fn).call(this, numbers);
  __privateMethod(this, _Lotto_instances, checkDuplicated_fn).call(this, numbers);
};
checkType_fn = function(numbers) {
  if (numbers.some((number) => typeof number !== "number")) {
    throw new Error(ERROR_MESSAGE.LOTTO.INVALID_TYPE);
  }
};
checkLength_fn = function(numbers) {
  if (numbers.length !== LOTTO.NUMBER_LENGTH) {
    throw new Error(ERROR_MESSAGE.LOTTO.INVALID_LENGTH);
  }
};
checkRange_fn = function(numbers) {
  if (numbers.some((number) => number < LOTTO.MIN_NUMBER || number > LOTTO.MAX_NUMBER)) {
    throw new Error(ERROR_MESSAGE.LOTTO.INVALID_RANGE);
  }
};
checkDuplicated_fn = function(numbers) {
  if (new Set(numbers).size !== LOTTO.NUMBER_LENGTH) {
    throw new Error(ERROR_MESSAGE.LOTTO.DUPLICATE);
  }
};
class LottoMachine {
  constructor(lottoCount) {
    __privateAdd(this, _LottoMachine_instances);
    __privateAdd(this, _lottos, []);
    __privateMethod(this, _LottoMachine_instances, validateLottoCount_fn).call(this, lottoCount);
    __privateSet(this, _lottos, __privateMethod(this, _LottoMachine_instances, generateLottos_fn).call(this, lottoCount));
  }
  get lottos() {
    return [...__privateGet(this, _lottos)];
  }
}
_lottos = new WeakMap();
_LottoMachine_instances = new WeakSet();
generateLottos_fn = function(lottoCount) {
  const generateLotto = () => __privateMethod(this, _LottoMachine_instances, generateLotto_fn).call(this).sort((a, b) => a - b);
  return Array.from({ length: lottoCount }, () => new Lotto(generateLotto()));
};
generateLotto_fn = function() {
  const lottoSet = /* @__PURE__ */ new Set();
  while (lottoSet.size < LOTTO.NUMBER_LENGTH) {
    const randomNumber = generateRandomNumber(LOTTO.MIN_NUMBER, LOTTO.MAX_NUMBER);
    lottoSet.add(randomNumber);
  }
  return [...lottoSet];
};
validateLottoCount_fn = function(count) {
  validateType(KEY.PURCHASE_COUNT, count);
  validateRange({
    key: KEY.PURCHASE_COUNT,
    value: count,
    min: PURCHASE_PRICE.MIN / PURCHASE_PRICE.UNIT,
    max: PURCHASE_PRICE.MAX / PURCHASE_PRICE.UNIT
  });
};
const validateDuplicate = (bonusNumber, winningNumbers) => {
  if (winningNumbers.includes(bonusNumber)) {
    throw new Error(ERROR_MESSAGE.BONUS_NUMBER.DUPLICATE);
  }
};
const BonusNumberValidator = {
  validate: (bonusNumber, winningNumbers) => {
    validateType(KEY.BONUS_NUMBER, bonusNumber);
    validateRange({
      key: KEY.BONUS_NUMBER,
      value: bonusNumber,
      min: LOTTO.MIN_NUMBER,
      max: LOTTO.MAX_NUMBER
    });
    validateDuplicate(bonusNumber, winningNumbers);
  }
};
class WinningResult {
  constructor(winningNumbers, bonusNumber) {
    __privateAdd(this, _WinningResult_instances);
    __privateAdd(this, _winningNumbers);
    __privateAdd(this, _bonusNumber);
    __privateSet(this, _winningNumbers, new Lotto(winningNumbers).numbers);
    BonusNumberValidator.validate(bonusNumber, winningNumbers);
    __privateSet(this, _bonusNumber, bonusNumber);
  }
  calculate(lottos) {
    const counts = Array(5).fill(0);
    lottos.forEach((lotto) => {
      const matchCount = __privateMethod(this, _WinningResult_instances, getMatchCount_fn).call(this, lotto);
      if (matchCount === 6) counts[4] += 1;
      if (matchCount === 5 && lotto.numbers.includes(__privateGet(this, _bonusNumber))) counts[3] += 1;
      if (matchCount === 5 && !lotto.numbers.includes(__privateGet(this, _bonusNumber))) counts[2] += 1;
      if (matchCount === 4) counts[1] += 1;
      if (matchCount === 3) counts[0] += 1;
    });
    return counts;
  }
  calculateProfitRate(lottoPurchasePrice, counts) {
    const totalReward = counts.reduce((acc, curr, i) => {
      return acc + curr * PROFIT[i];
    }, 0);
    return (totalReward - lottoPurchasePrice) / lottoPurchasePrice * 100;
  }
}
_winningNumbers = new WeakMap();
_bonusNumber = new WeakMap();
_WinningResult_instances = new WeakSet();
getMatchCount_fn = function(lotto) {
  const sumSet = /* @__PURE__ */ new Set([...lotto.numbers, ...__privateGet(this, _winningNumbers)]);
  const matchCount = lotto.numbers.length + __privateGet(this, _winningNumbers).length - sumSet.size;
  return matchCount;
};
const getById = (id) => document.getElementById(id);
const getByClass = (className) => document.getElementsByClassName(className);
const getByTag = (tagName) => document.getElementsByTagName(tagName);
const querySelector = (selector) => document.querySelector(selector);
const createTag = (tagName) => document.createElement(tagName);
const showElement = ($target) => $target.classList.remove("hidden");
const hideElement = ($target) => $target.classList.add("hidden");
const disableElement = (id) => {
  getById(id).disabled = true;
};
const enableElement = (id) => {
  getById(id).disabled = false;
};
const createContainer = (tag, { padding, margin }) => {
  const $container = createTag(tag);
  if (padding) $container.style.padding = padding;
  if (margin) $container.style.margin = margin;
  return $container;
};
const WinningInput = {
  appendWinningInput: ($target) => {
    const numbersArray = Array.from({ length: 6 }, (_, idx) => idx + 1);
    const $winningInputContainer = createTag("div");
    $winningInputContainer.classList.add("winningNumbersContainer");
    numbersArray.forEach((number) => {
      const $input = createTag("input");
      $input.min = 1;
      $input.max = 45;
      $input.id = `winningNumber_${number}`;
      $input.required = true;
      $winningInputContainer.appendChild($input);
    });
    $target.appendChild($winningInputContainer);
  }
};
const BonusInput = {
  appendBonusInput: ($target) => {
    const $input = createTag("input");
    $input.min = 1;
    $input.max = 45;
    $input.id = "bonusNumber";
    $input.required = true;
    $target.appendChild($input);
  }
};
const LottoResultModal = {
  $modalContainer: getByClass("modalContainer")[0],
  createTable(winningCounts) {
    const $tableBody = querySelector(".lottoResultTable > tbody");
    winningCounts.forEach((count, idx) => {
      const $tr = createTag("tr");
      const { $matchCount, $winningMoney, $winningCount } = this.createRow(count, idx);
      $tr.appendChild($matchCount);
      $tr.appendChild($winningMoney);
      $tr.appendChild($winningCount);
      $tableBody.appendChild($tr);
    });
  },
  createRow(count, idx) {
    const $matchCount = createTag("td");
    $matchCount.textContent = `${LOTTO_COUNT[idx]}개`;
    if (idx === 3) $matchCount.textContent += "+보너스볼";
    const $winningMoney = createTag("td");
    $winningMoney.textContent = `${PROFIT[idx].toLocaleString()}`;
    const $winningCount = createTag("td");
    $winningCount.textContent = `${count}개`;
    return { $matchCount, $winningMoney, $winningCount };
  },
  createProfit(profit) {
    const $profitText = getByClass("profitText")[0];
    $profitText.textContent = `당신의 총 수익률은 ${profit.toFixed(1).toLocaleString()}%입니다.`;
  },
  openModal() {
    this.$modalContainer.classList.remove("hidden");
  },
  closeModal() {
    this.$modalContainer.classList.add("hidden");
  },
  resetLotto() {
    getById("purchaseInput").value = "";
    getByClass("lottoList")[0].replaceChildren();
    getByClass("winningNumbersInput")[0].replaceChildren();
    getByTag("tbody")[0].replaceChildren();
    enableElement("purchaseInput");
    enableElement("purchaseButton");
    hideElement(getByClass("hiddenContainer")[0]);
  }
};
const OutputView = {
  printPurchaseLottos(lottoCount, lottos) {
    const $lottoList = getByClass("lottoList")[0];
    const $lottoCountDescDiv = createContainer("div", { padding: "1rem 0" });
    $lottoCountDescDiv.textContent = `총 ${lottoCount}개를 구매하였습니다.`;
    $lottoList.appendChild($lottoCountDescDiv);
    this.printLottos(lottos, $lottoList);
    const $hiddenContainer = getByClass("hiddenContainer")[0];
    showElement($hiddenContainer);
    this.disablePurchase();
    this.generateWinningAndBonusInput();
  },
  printLottos(lottos, $target) {
    const $lottoListDiv = createContainer("div", {});
    $lottoListDiv.classList.add("lottoListContainer");
    const $lottoListUl = createContainer("ul", { padding: "0.5rem 0" });
    $lottoListUl.classList.add("lottoContainer");
    lottos.forEach((lotto) => {
      this.makeLotto($lottoListUl, lotto.numbers);
    });
    $lottoListDiv.appendChild($lottoListUl);
    $target.appendChild($lottoListDiv);
  },
  makeLotto($lottoListDiv, lotto) {
    const $lottoDiv = createTag("li");
    $lottoDiv.classList.add("lottoItem");
    const $imoji = createTag("span");
    $imoji.textContent = "🎟️";
    $imoji.classList.add("lottoImoji");
    const $lottoText = document.createTextNode(`${lotto.join(", ")}`);
    $lottoDiv.appendChild($imoji);
    $lottoDiv.appendChild($lottoText);
    $lottoListDiv.appendChild($lottoDiv);
  },
  disablePurchase() {
    disableElement("purchaseInput");
    disableElement("purchaseButton");
  },
  generateWinningAndBonusInput() {
    const $winningNumbersInput = getByClass("winningNumbersInput")[0];
    WinningInput.appendWinningInput($winningNumbersInput);
    BonusInput.appendBonusInput($winningNumbersInput);
  },
  showModal(winningCounts, profitRate) {
    LottoResultModal.createTable(winningCounts);
    LottoResultModal.createProfit(profitRate);
    LottoResultModal.openModal();
  }
};
const InputView = {
  $purchaseInput: getById("purchaseInput"),
  $purchaseForm: document.querySelector("section.purchase form"),
  enterPurchasePrice() {
    return new Promise((resolve) => {
      this.$purchaseForm.addEventListener("submit", (e) => {
        e.preventDefault();
        try {
          resolve(this.getPurchasePrice());
        } catch (error) {
          alert(error.message);
          this.resetPurchaseInput();
        }
      });
    });
  },
  async enterWinningAndBonusNumber() {
    const $resultButton = getByClass("resultButton")[0];
    return new Promise((resolve) => {
      $resultButton.addEventListener("click", (e) => {
        e.preventDefault();
        try {
          resolve(this.getWinningAndBonusNumbers());
        } catch (error) {
          alert(error.message);
        }
      });
    });
  }
};
const retryUntilValidInWeb = async (func, ...arg) => {
  try {
    return await func(...arg);
  } catch (error) {
    return retryUntilValidInWeb(func, ...arg);
  }
};
const WebController = {
  async start() {
    const { purchasePrice, lottos } = await this.processLottoPurchase();
    const winningResult = await this.generateWinningResult();
    const winningCounts = winningResult.calculate(lottos);
    const profitRate = winningResult.calculateProfitRate(purchasePrice, winningCounts);
    OutputView.showModal(winningCounts, profitRate);
  },
  async processLottoPurchase() {
    const { purchasePrice, lottoCount } = await retryUntilValidInWeb(
      async () => await InputView.enterPurchasePrice()
    );
    const lottoMachine = new LottoMachine(lottoCount);
    OutputView.printPurchaseLottos(lottoCount, lottoMachine.lottos);
    return { purchasePrice, lottos: lottoMachine.lottos };
  },
  async generateWinningResult() {
    const { winningNumbers, bonusNumber } = await retryUntilValidInWeb(
      async () => await InputView.enterWinningAndBonusNumber()
    );
    return new WinningResult(winningNumbers, bonusNumber);
  }
};
const addClickListener = (className, callback) => {
  const $target = getByClass(className)[0];
  $target.addEventListener("click", callback);
};
const initializeEvent = () => {
  addClickListener("closeButton", () => LottoResultModal.closeModal());
  addClickListener("modalBackground", () => LottoResultModal.closeModal());
  addClickListener("resetButton", () => {
    LottoResultModal.closeModal();
    LottoResultModal.resetLotto();
    WebController.start();
  });
};
initializeEvent();
WebController.start();
