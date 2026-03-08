import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DigitoDashboardMegaCripto } from "../target/types/digito_dashboard_mega_cripto";

describe("digito_dashboard_mega_cripto", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.digitoDashboardMegaCripto as Program<DigitoDashboardMegaCripto>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
