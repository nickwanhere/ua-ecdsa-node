import server from "./server";
import { useEffect } from "react";

function Wallet({ privateKey, setPrivateKey, address, balance, setBalance }) {
  useEffect(() => {
    if (address != "") getBalance();
  }, [address]);

  async function getBalance() {
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  const onChangePK = (evt) => {
    setPrivateKey(evt.target.value);
  };

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <div>{address}</div>
      </label>

      <label>
        Your Private Key to sign message
        <input value={privateKey} onChange={onChangePK}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
