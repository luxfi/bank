import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { CardCurrencies } from '@/components/CardCurrencies';
import { CardCurrenciesAdd } from '@/components/CardCurrenciesAdd';
import Skeleton from '@/components/Skeleton';

import { UserRole } from '@/models/auth';

import { useAuth } from '@/store/useAuth';
import { useWallet } from '@/store/useWallet';
import { IWallet } from '@/store/useWallet/types';
import { Icon, Row } from '@luxbank/ui';

import { ArrowButton, CurrenciesContainer } from './styles';

export const Currencies: React.FC = () => {
  const router = useRouter();
  const { currentUser } = useAuth();

  const { getWallets, clearWallets } = useWallet();

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  const [wallets, setWallets] = useState<Array<IWallet>>([]);
  const [loading, setLoading] = useState(false);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const response = await getWallets({});
      if (Array.isArray(response) && response.length > 0) {
        setWallets(response?.sort((a, b) => b.amount - a.amount));
      }
    } finally {
      setLoading(false);
    }
  };

  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetchWallets();

    const container = scrollContainerRef.current as HTMLDivElement;

    container.addEventListener('scroll', checkScrollButtons, { passive: true });
    checkScrollButtons();

    return () => {
      container.removeEventListener('scroll', checkScrollButtons);
    };
  }, []);

  return (
    <Row style={{ gap: 16, marginTop: 16, width: '100%' }}>
      <ArrowButton onClick={() => scrollLeft()} $show={showLeftButton}>
        <Icon variant="alt-arrow-left" />
      </ArrowButton>

      {currentUser?.role !== UserRole.ViewerUser && (
        <CardCurrenciesAdd
          onClick={() => {
            router.push(`/wallet/add`);
          }}
        />
      )}

      <CurrenciesContainer ref={scrollContainerRef}>
        {loading &&
          [...Array(4)].map((a, i) => (
            <Skeleton width={240} height={100} key={i} />
          ))}

        {wallets
          // ?.filter((wallet) => Number(wallet?.amount ?? 0) > 0)
          ?.map((wallet) => (
            <CardCurrencies
              key={wallet.name}
              amount={wallet.amount}
              name={wallet.name}
              code={wallet.currency}
              onClick={() => {
                clearWallets();

                router.push(
                  `/wallet/details?amount=${wallet.amount}&currency=${wallet.currency}&name=${wallet.name}`
                );
              }}
            />
          ))}
      </CurrenciesContainer>

      <ArrowButton onClick={() => scrollRight()} $show={showRightButton}>
        <Icon variant="alt-arrow-right" />
      </ArrowButton>
    </Row>
  );
};
