import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Contract1 } from "../target/types/contract_1";

describe("contract-1", () => {
  // Configure the client to use the local cluster.
  let provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.Contract1 as Program<Contract1>;
  let calculator = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize()
      .accounts({
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([calculator, provider.wallet.payer]) // Ensure the provider wallet and calculator are signers
      .rpc();
    let accounts = await program.account.calc.fetch(calculator.publicKey);
    console.log("Accounts are: ", accounts);
    console.log("Your transaction signature", tx);
  });

  it("Adds!", async () => {
    let tx = await program.methods
      .add(new anchor.BN(3), new anchor.BN(3))
      .accounts({
        calculator: calculator.publicKey, // Include the calculator account here
        user: provider.wallet.publicKey,
      })
      .signers([provider.wallet.payer]) // Ensure the provider wallet is a signer
      .rpc();
    let accounts = await program.account.calc.fetch(calculator.publicKey);
    console.log("Accounts are: ", accounts);
    console.log("Your transaction signature", tx);
  });

  it("Balance shit!", async () => {
    const balance = await provider.connection.getBalance(calculator.publicKey);
    console.log(
      "Calculator account balance:",
      balance / anchor.web3.LAMPORTS_PER_SOL,
      "SOL"
    );
  });
});
