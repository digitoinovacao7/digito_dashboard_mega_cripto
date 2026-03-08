use anchor_lang::prelude::*;

declare_id!("3PSnWULou1gWHj1SxGL4S5Gu12PrrRvHsGifqpM4CjH9");

#[program]
pub mod digito_dashboard_mega_cripto {
    use super::*;

    pub fn initialize_user(ctx: Context<InitializeUser>, pix_key: String) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        user_account.authority = ctx.accounts.authority.key();
        user_account.pix_key = pix_key;
        Ok(())
    }

    pub fn register_bet(
        ctx: Context<RegisterBet>,
        numbers: [u8; 15],
        draw_id: u64,
        pix_transaction_id: String,
    ) -> Result<()> {
        let bet_account = &mut ctx.accounts.bet_account;
        
        // Ensure server (admin) signed the transaction to prevent free bets
        require!(ctx.accounts.server_authority.is_signer, CustomError::Unauthorized);
        
        bet_account.user_pubkey = ctx.accounts.user.key();
        bet_account.numbers = numbers;
        bet_account.draw_id = draw_id;
        bet_account.pix_transaction_id = pix_transaction_id;
        bet_account.timestamp = Clock::get()?.unix_timestamp;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 4 + 100 // 8 discriminator, 32 pubkey, 4 string prefix, up to 100 bytes for pix_key
    )]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterBet<'info> {
    #[account(
        init,
        payer = server_authority,
        space = 8 + 32 + 15 + 8 + 4 + 64 + 8 // Discriminator + Pubkey + 15 bytes + u64 + string prefix + 64 bytes for tx id + i64
    )]
    pub bet_account: Account<'info, Bet>,
    
    /// CHECK: The user who owns the bet, does not need to sign as server pays
    pub user: AccountInfo<'info>,
    
    #[account(mut)]
    pub server_authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct UserAccount {
    pub authority: Pubkey,
    pub pix_key: String,
}

#[account]
pub struct Bet {
    pub user_pubkey: Pubkey,
    pub numbers: [u8; 15],
    pub draw_id: u64,
    pub pix_transaction_id: String,
    pub timestamp: i64,
}

#[error_code]
pub enum CustomError {
    #[msg("Unauthorized server authority")]
    Unauthorized,
}
