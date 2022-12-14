import "./css/index.css";
import IMask from "imask";

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

function setCardType(type) {
  const colors = {
    americanexpress: ["black", "gray"],
    visa: ["#436D99", "#2D57F2"],
    discover: ["black", "gray"],
    diners: ["black", "gray"],
    hypercard: ["black", "gray"],
    jcb: ["black", "gray"],
    maestro: ["black", "gray"],
    unionpay: ["black", "gray"],
    mastercard: ["#DF6F29", "#C69347"],
    // rocketseat: ["#0D5F5D", "#C3129C"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0]);
  ccBgColor02.setAttribute("fill", colors[type][1]);
  ccLogo.setAttribute("src", `cc-${type}.svg`)

}

globalThis.setCardType = setCardType;

const securityCode = document.querySelector("#security-code");
const securityCodePattern = {
  mask: "000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern);

const expirationDate = document.querySelector("#expiration-date");
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    }
  }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "americanexpress"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^3[47]\d{0,13}/,
      cardType: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
      cardType: "discover"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,
      cardType: "diners"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:2131|1800)\d{0,11}/,
      cardType: "hypercard"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:35\d{0,2})\d{0,12}/,
      cardType: "jcb"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,
      cardType: "maestro"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /^62\d{0,14}/,
      cardType: "unionpay"
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default"
    }
  ],
  dispatch: function(appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "");
    const foundMask = dynamicMasked.compiledMasks.find(function(item){
      return number.match(item.regex)
    })
    //console.log(foundMask);
    return foundMask;
  }
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

const cardHolder = document.querySelector("#card-holder");
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value");
  ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value;
});

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value);
});

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value");
  ccSecurity.innerText = code.length === 0 ? "123" : code;
};

// Por que n??o funciona?
// securityCodeMasked.on("accept", function updateSecurityCode(code) {
//   const ccSecurity = document.querySelector(".cc-security .value");
//   ccSecurity.innerText = code.length === 0 ? "123" : code;
// });

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardType;
  setCardType(cardType);
  updateCardNumber(cardNumberMasked.value);
});

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number");
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number;
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDate.value);
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value");
  ccExpiration.innerText = date.length === 0 ? "02/32" : date;
}

const addButton = document.querySelector("#add-card");
addButton.addEventListener("click", (e) => {
  //e.preventDefault();
  alert("Cart??o adicionado com sucesso!");
});

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  form.reset();
  defaultInputs();
});

function defaultInputs() {
  const cardType = document.querySelector(".cc-logo .cc-logo-default");
  cardType.src = '/cc-default.svg';

  const ccNumber = document.querySelector(".cc-number");
  ccNumber.innerText = cardNumber.value.length === 0 ? "1234 5678 9012 3456" : cardNumber.value;

  const ccHolder = document.querySelector(".cc-holder .value");
  ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value;

  const ccExpiration = document.querySelector(".cc-extra .value");
  ccExpiration.innerText = expirationDate.value.length === 0 ? "02/32" : expirationDate.value;

  const ccSecurity = document.querySelector(".cc-security .value");
  ccSecurity.innerText = securityCode.value.length === 0 ? "123" : securityCode.value;
}