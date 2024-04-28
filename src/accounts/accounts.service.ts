import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountsService {
  private accountBalance: Record<string, number> = {
    USD: 0,
    EUR: 0,
    GBP: 0,
  };

  async topUpAccount(currency: string, amount: number): Promise<string> {
    if (!this.isValidCurrency(currency)) {
      return 'Currency is Invalid';
    }

    if (amount <= 0) {
      return 'Amount is Invalid';
    }

    this.accountBalance[currency] += amount;

    return `Account topped up with ${amount} ${currency}`;
  }

  async getAccountBalance(): Promise<{ balances: Record<string, number> }> {
    return { balances: this.accountBalance };
  }

  private isValidCurrency(currency: string): boolean {
    const validCurrencies = ['USD', 'EUR', 'GBP'];
    return validCurrencies.some((validCurrency) => validCurrency === currency);
  }
}
