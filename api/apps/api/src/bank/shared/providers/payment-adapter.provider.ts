import { GetLoggedUserUseCase } from '@domain/use-cases';
import { FactoryProvider, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PaymentProviderCurrencyCloud } from '@ports/currency-cloud';
import { PaymentProviderIFX } from '@ports/ifx';
import { EPaymentProvider } from '@tools/misc';
import { UserRole } from '@tools/models';
import { PayloadInterface } from 'apps/api/src/auth/payload.interface';
import { Request } from 'express';
import { decode } from 'jsonwebtoken';

export const paymentAdapter = <
  T extends abstract new (...args: any) => any,
  J extends new (...args: any) => any,
  I extends new (...args: any) => any,
>(
  abstraction: T,
  {
    factory,
    inject = [],
  }: {
    factory: {
      currencyCloud: J;
      ifx: I;
    };
    inject?: any[];
  },
): FactoryProvider<any> => {
  return {
    provide: abstraction,
    inject: [REQUEST, GetLoggedUserUseCase, ...inject],
    scope: Scope.REQUEST,
    useFactory: async (
      req: Request,
      getLoggedUserUseCase: GetLoggedUserUseCase,
      ...injetions
    ) => {
      const auth = req.headers['authorization']?.split('Bearer ')?.at(1) ?? '';
      const jwtPayload = decode(auth) as PayloadInterface;

      if (!jwtPayload) return;

      if (jwtPayload.role === UserRole.SuperAdmin) return;

      const user = await getLoggedUserUseCase.handle(jwtPayload);
      const paymentProvider = user
        ?.getCurrentClient()
        ?.account?.getPaymentProvider();

      if (!paymentProvider) throw new Error('Not found payment provider');

      if (!user) throw new Error('Not found user');

      const CCPort = new PaymentProviderCurrencyCloud();
      const IFXPort = new PaymentProviderIFX(user);

      const map = {
        [EPaymentProvider.CURRENCY_CLOUND]: (...rest: any[]) =>
          new factory.currencyCloud(CCPort, ...rest),
        [EPaymentProvider.IFX]: (...rest) => new factory.ifx(IFXPort, ...rest),
      };

      const gateway: any = map[paymentProvider];

      if (!gateway) throw new Error('Not found payment provider');

      return gateway(...[req, ...injetions]);
    },
  };
};
