var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Property } from './json';
import BigNumber from 'bignumber.js';
export var Currency = (function () {
    function Currency(codeOrPrototype) {
        if (typeof codeOrPrototype === 'string') {
            this._code = codeOrPrototype;
        }
        else if (codeOrPrototype['code'] && typeof codeOrPrototype['code'] === 'string') {
            this._code = codeOrPrototype['code'];
        }
        else {
            throw 'Currency code must be given in order to create Currency instance';
        }
    }
    Object.defineProperty(Currency.prototype, "code", {
        get: function () {
            return this._code;
        },
        enumerable: true,
        configurable: true
    });
    Currency.prototype.toString = function () {
        return this._code;
    };
    Currency.prototype.toJSON = function () {
        return this._code;
    };
    Currency.prototype.fromJSON = function (json) {
        if (typeof json === 'string') {
            this._code = json;
        }
        else if (json && typeof json['code'] === 'string') {
            this._code = json['code'];
        }
        else {
            throw 'Cannot unserialize "' + json + '" to Currency instance';
        }
    };
    return Currency;
}());
function toBigNumber(value) {
    if (value instanceof BigNumber) {
        return value;
    }
    else if (typeof value === 'number') {
        return new BigNumber(value);
    }
    else if (typeof value === 'string') {
        return new BigNumber(value);
    }
    else {
        throw 'Given value: "' + value + '" cannot be converted to BigNumber.';
    }
}
export var Money = (function () {
    function Money(currencyOrPrototype, amount) {
        if (currencyOrPrototype instanceof Currency || typeof currencyOrPrototype === "string") {
            this._currency = currencyOrPrototype instanceof Currency ? currencyOrPrototype : new Currency(currencyOrPrototype);
            this._amount = toBigNumber(amount);
        }
        else if (currencyOrPrototype) {
            this._amount = toBigNumber(currencyOrPrototype['amount']);
            this._currency = currencyOrPrototype['currency'] instanceof Currency ? currencyOrPrototype['amount'] : new Currency(currencyOrPrototype['currency']);
        }
    }
    Object.defineProperty(Money.prototype, "currency", {
        get: function () {
            return this._currency;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Money.prototype, "amount", {
        get: function () {
            return this._amount;
        },
        enumerable: true,
        configurable: true
    });
    Money.prototype.plus = function (amount) {
        return new Money(this._currency, this._amount.plus(amount));
    };
    Money.prototype.minus = function (amount) {
        return new Money(this._currency, this._amount.minus(amount));
    };
    Money.prototype.times = function (amount) {
        return new Money(this._currency, this._amount.times(amount));
    };
    Money.prototype.dividedBy = function (amount) {
        return new Money(this._currency, this._amount.dividedBy(amount));
    };
    Money.prototype.compareTo = function (money) {
        if (typeof money === "number")
            return this._amount.comparedTo(money);
        else if (money instanceof BigNumber)
            return this._amount.comparedTo(money);
        else if (money)
            return this._amount.comparedTo(money.amount);
        else
            throw "Cannot compare empty value";
    };
    __decorate([
        Property(Currency, 'currency'), 
        __metadata('design:type', Currency)
    ], Money.prototype, "_currency", void 0);
    __decorate([
        Property(BigNumber, 'amount'), 
        __metadata('design:type', BigNumber)
    ], Money.prototype, "_amount", void 0);
    return Money;
}());
//# sourceMappingURL=finance.js.map