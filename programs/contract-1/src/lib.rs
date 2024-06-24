use anchor_lang::prelude::*;

declare_id!("8FdCcvzpYoqWDYuXNv7GCewH455vgqxSnzjebxhsxWRC");

#[account]
pub struct Calc {
    pub result: u64,
    pub remainder: u64,
}

#[derive(Accounts)]
pub struct Operation<'info> {
    #[account(mut)]
    pub calculator: Account<'info, Calc>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8+16)]
    calculator: Account<'info, Calc>,
    #[account(mut)]
    user: Signer<'info>,
    system_program: Program<'info, System>,
}

#[program]
pub mod contract_1 {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        let calculator = &mut ctx.accounts.calculator;
        calculator.result = 69;
        calculator.remainder = 96;

        Ok(())
    }

    pub fn add(ctx: Context<Operation>, n1: u64, n2: u64) -> Result<u64> {
        let calc = &mut ctx.accounts.calculator;
        calc.result = n1 + n2;
        calc.remainder = 0;

        Ok(calc.result)
    }
}
