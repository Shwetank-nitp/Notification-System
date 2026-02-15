import INotifyEngineStrategy from '../interface/INotifyEngineStrategy';

class WhatsappStrategy implements INotifyEngineStrategy {
  async send(): Promise<void> {}
}

export default WhatsappStrategy;
