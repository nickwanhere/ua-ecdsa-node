import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  const changePrivateKey = (input) => {
    //compute address
    console.log(input);
    setAddress(toHex(secp256k1.getPublicKey(input)));
    setPrivateKey(input);
  };

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        privateKey={privateKey}
        setPrivateKey={changePrivateKey}
      />
      <Transfer
        setBalance={setBalance}
        address={address}
        privateKey={privateKey}
      />
    </div>
  );
}

export default App;
