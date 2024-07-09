'use client';

import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  IMessageProps,
  IQuestionProps,
  Message,
  Question,
} from '@/components/Messages';

interface IQuestion extends Omit<IQuestionProps, 'onCancel'> {
  type: 'question';
  onCancel?(): void;
}

interface IMessage extends Omit<IMessageProps, 'onClose'> {
  onClose?(): void;
  type: 'message';
}

type TTypes = 'question' | 'message';

interface IProps {
  onShowMessage(data: IQuestion | IMessage): void;
}

const MessagesContext = createContext({} as IProps);

const init: IQuestion | IMessage = {
  type: 'message',
  description: '',
  onClose: () => null,
  isVisible: false,
  title: '',
};

export function MessagesProvider({ children }: PropsWithChildren) {
  const [alertMessage, setAlertMessage] = useState<IQuestion | IMessage>(init);

  const handleMessage = useCallback((data: IQuestion | IMessage) => {
    setAlertMessage({ ...data });
  }, []);

  const handleConfirmMessage = useCallback(() => {
    if (!alertMessage?.onConfirm) return;

    setAlertMessage((pS) => ({ ...pS, isVisible: false }));
    return alertMessage.onConfirm();
  }, []);

  const messageComponent = useMemo(() => {
    const component: Record<TTypes, React.ReactNode> = {
      message: (
        <Message
          status={(alertMessage as IMessage)?.status}
          isVisible={(alertMessage as IMessage).isVisible}
          description={(alertMessage as IMessage)?.description}
          title={(alertMessage as IMessage).title}
          textButtonConfirm={(alertMessage as IMessage)?.textButtonConfirm}
          showConfirmButton={!!alertMessage?.onConfirm}
          onConfirm={() => alertMessage?.onConfirm && handleConfirmMessage()}
          onClose={() => {
            (alertMessage as IMessage)?.onClose &&
              (alertMessage as any).onClose();
            setAlertMessage((pS) => ({ ...pS, isVisible: false }));
          }}
        />
      ),
      question: (
        <Question
          isVisible={alertMessage.isVisible}
          onCancel={() => {
            if ((alertMessage as IQuestion)?.onCancel) {
              (alertMessage as IQuestion).onCancel!();
            }

            setAlertMessage((pS) => ({ ...pS, isVisible: false }));
          }}
          title={alertMessage.title}
          description={alertMessage?.description}
          icon={(alertMessage as IQuestion)?.icon}
          textButtonCancel={(alertMessage as IQuestion)?.textButtonCancel}
          textButtonConfirm={(alertMessage as IQuestion)?.textButtonConfirm}
          onConfirm={() => {
            setAlertMessage((pS) => ({ ...pS, isVisible: false }));
            (alertMessage as IQuestion)?.onConfirm &&
              (alertMessage as IQuestion)?.onConfirm();
          }}
        />
      ),
    };

    return component[alertMessage.type];
  }, [alertMessage]);

  const values = useMemo(
    (): IProps => ({
      onShowMessage: handleMessage,
    }),
    [handleMessage]
  );

  return (
    <MessagesContext.Provider value={values}>
      {messageComponent}
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  return context;
}
