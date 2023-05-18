import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import JSONbig from "json-bigint";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const pmsg = `${address}:${recipient}:${parseInt(sendAmount)}`;

    console.log(toHex(secp256k1.getPublicKey(privateKey)));
    console.log(address);

    //calclate signature
    const signature = await signMessage(pmsg);

    console.log(
      secp256k1.verify(
        { r: signature.r, s: signature.s },
        toHex(hashMessage(pmsg)),
        toHex(secp256k1.getPublicKey(privateKey))
      )
    );

    console.log(hashMessage(pmsg));

    try {
      const r = signature.r.toString();
      const s = signature.s.toString();

      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        r: r,
        s: s,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  async function signMessage(msg) {
    return await secp256k1.sign(toHex(hashMessage(msg)), privateKey);
  }

  function hashMessage(message) {
    return keccak256(utf8ToBytes(message));
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
