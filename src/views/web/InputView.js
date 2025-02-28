import { PURCHASE_PRICE } from '../../constants/CONFIGURATIONS.js';
import { getById, getByClass } from '../../utils/dom.js';
import { BonusNumberValidator } from '../../validators/BonusNumberValidator.js';
import { PurchasePriceValidator } from '../../validators/PurchasePriceValidator.js';
import { WinningNumbersValidator } from '../../validators/WinningNumbersValidator.js';
import LottoResultModal from './components/LottoResultModal.js';

const InputView = {
  $purchaseInput: getById('purchaseInput'),
  $purchaseForm: document.querySelector('section.purchase form'),

  enterPurchasePrice() {
    return new Promise((resolve) => {
      this.$purchaseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        try {
          console.log('this 객체:', this);
          console.log('this 타입:', Object.prototype.toString.call(this));
          console.log('this.getPurchasePrice 존재 여부:', 'getPurchasePrice' in this);
          console.log('this.getPurchasePrice 타입:', typeof this.getPurchasePrice);
          console.log('InputView.getPurchasePrice 존재 여부:', 'getPurchasePrice' in InputView);

          resolve(this.getPurchasePrice());
        } catch (error) {
          alert(error.message);
          this.resetPurchaseInput();
        }
      });
    });
  },

  getPurchasePrice() {
    const purchasePrice = Number(this.$purchaseInput.value);
    PurchasePriceValidator.validate(Number(this.$purchaseInput.value));
    const lottoCount = purchasePrice / PURCHASE_PRICE.UNIT;
    return { purchasePrice, lottoCount };
  },

  resetPurchaseInput() {
    this.$purchaseInput.focus();
    this.$purchaseInput.value = '';
  },

  async enterWinningAndBonusNumber() {
    const $resultButton = getByClass('resultButton')[0];

    return new Promise((resolve) => {
      $resultButton.addEventListener('click', (e) => {
        e.preventDefault();

        try {
          resolve(this.getWinningAndBonusNumbers());
        } catch (error) {
          alert(error.message);
        }
      });
    });
  },

  getWinningAndBonusNumbers() {
    const winningNumbers = Array.from({ length: 6 }, (_, idx) => idx + 1).map((idx) =>
      Number(getById(`winningNumber_${idx}`).value),
    );
    const bonusNumber = Number(getById('bonusNumber').value);
    WinningNumbersValidator.validate(winningNumbers);
    BonusNumberValidator.validate(bonusNumber, winningNumbers);
    LottoResultModal.openModal();

    return { winningNumbers, bonusNumber };
  },
};

export default InputView;
