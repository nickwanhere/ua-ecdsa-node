const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const JSONbig = require("json-bigint");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  "037125efb08a42f186abf706cf0ebd9946da74cfbac7043e2615cc454c5b0d630a": 100,
  "03b3ae6ab16c18beb9d98c926e0ef09b6dc8a924f8004978f27569ee2e5ab783e4": 50,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { sender, recipient, amount, r, s } = req.body;

  const parsed_sig = { r: BigInt(r), s: BigInt(s) };
  const pmsg = `${sender}:${recipient}:${parseInt(amount)}`;

  const hmesageHash = hashMessage(pmsg);

  const is_sign = secp256k1.verify(parsed_sig, toHex(hmesageHash), sender);

  console.log(is_sign);

  if (!is_sign) {
    res.send("not auth");
  } else {
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  }
});

function hashMessage(message) {
  return keccak256(utf8ToBytes(message));
}

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
