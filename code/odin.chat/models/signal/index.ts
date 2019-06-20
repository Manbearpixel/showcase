export class SignalClient {
  store: any; //LibsignalProtocol.Interface.ISignalProtocolStore;
  registrationId: number;
  username: string;
  deviceId: number;
}

export class SignalClientSerialized {
  username: string;
  //...
}

export class SignalClientContact {
  address: SignalAddress;
  //...
}

export class PreKeyBundle {
  registrationId: number;
  //...
}

export class LocalContact {
  address: SignalAddress;
  //...
}

export class SignalAddress {
  name: string;
  //...
}

export class SignalClientPreKey {
  id: number;
  //...
}

export interface SignedPreKey {
  id: number;
  //...
}

export interface PublicPreKey {
  id: number;
  //...
}

export interface PreKeyBundle {
  //...
}

export interface SignalClientContact {
  address: SignalAddress;
  //...
}
