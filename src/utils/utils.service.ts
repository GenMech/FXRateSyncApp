import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {
  isRateValid(lastRefreshed: Date | undefined): boolean {
    if (!lastRefreshed) {
      return false;
    }

    const currentTime = new Date().getTime() / 1000;
    const rateAge = currentTime - lastRefreshed.getTime() / 1000;
    const validityPeriod = 30 * 1000;

    return rateAge <= validityPeriod;
  }
}
