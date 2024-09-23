use anchor_lang::prelude::*;

declare_id!("2VRzsVjWuUcgRDntsicF56XompNaQR5BehUSBfvPQaS6");

#[program]
pub mod group_payment {
    use super::*;

    pub fn create_user_info(ctx: Context<CreateUserInfo>, username: String) -> Result<()> {
        let user_info = &mut ctx.accounts.user_info;
        user_info.owner = ctx.accounts.owner.key();
        user_info.username = username;
        Ok(())
    }

    pub fn create_group(
        ctx: Context<CreateGroup>,
        title: String,
        recipient: Pubkey, // Taking recipient as input
        members: Vec<Pubkey>,
    ) -> Result<()> {
        let group_info = &mut ctx.accounts.group_info;
        group_info.admin = ctx.accounts.admin.key();
        group_info.title = title;
        group_info.recipient = recipient;
        group_info.members = members;
        group_info.active = true;
        Ok(())
    }

    pub fn accept_group_invitation(ctx: Context<AcceptInvitation>) -> Result<()> {
        let group_info = &mut ctx.accounts.group_info;
        let user_info = &ctx.accounts.user_info;

        if !group_info.members.contains(&user_info.owner) {
            return Err(ErrorCode::NotAMember.into());
        }

        // Logic to accept invitation
        group_info.accepted_members.push(user_info.owner);
        Ok(())
    }

    pub fn allot_amount(ctx: Context<AllotAmount>, amount: u64) -> Result<()> {
        let group_info = &mut ctx.accounts.group_info;

        if ctx.accounts.admin.key() != group_info.admin {
            return Err(ErrorCode::Unauthorized.into());
        }

        let member_info = &mut ctx.accounts.member_info;
        member_info.allotted_amount = amount;

        Ok(())
    }

    pub fn send_payment(ctx: Context<SendPayment>, amount: u64) -> Result<()> {
        let group_info = &ctx.accounts.group_info;
        let member_info = &mut ctx.accounts.member_info;

        if !group_info.accepted_members.contains(&ctx.accounts.payer.key()) {
            return Err(ErrorCode::NotAccepted.into());
        }

        // Ensure the user sends the correct amount
        if member_info.allotted_amount != amount {
            return Err(ErrorCode::IncorrectAmount.into());
        }

        // Perform SOL transfer
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.payer.key(),
            &group_info.recipient,
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[ctx.accounts.payer.to_account_info(), ctx.accounts.system_program.to_account_info()],
        )?;

        Ok(())
    }
}

// Contexts
#[derive(Accounts)]
pub struct CreateUserInfo<'info> {
    #[account(init, payer = owner, space = 8 + 40)]
    pub user_info: Account<'info, UserInfo>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateGroup<'info> {
    #[account(init, payer = admin, space = 8 + 160 + title.len())]
    pub group_info: Account<'info, GroupInfo>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AcceptInvitation<'info> {
    #[account(mut)]
    pub group_info: Account<'info, GroupInfo>,
    #[account(mut)]
    pub user_info: Account<'info, UserInfo>,
}

#[derive(Accounts)]
pub struct AllotAmount<'info> {
    #[account(mut)]
    pub group_info: Account<'info, GroupInfo>,
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(mut)]
    pub member_info: Account<'info, MemberInfo>,
}

#[derive(Accounts)]
pub struct SendPayment<'info> {
    #[account(mut)]
    pub group_info: Account<'info, GroupInfo>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub member_info: Account<'info, MemberInfo>,
    pub system_program: Program<'info, System>,
}

// State
#[account]
pub struct UserInfo {
    pub owner: Pubkey,
    pub username: String,
}

#[account]
pub struct GroupInfo {
    pub admin: Pubkey,
    pub title: String,
    pub recipient: Pubkey,
    pub members: Vec<Pubkey>,
    pub accepted_members: Vec<Pubkey>,
    pub active: bool,
}

#[account]
pub struct MemberInfo {
    pub owner: Pubkey,
    pub allotted_amount: u64,
}

// Errors
#[error_code]
pub enum ErrorCode {
    #[msg("You are not a member of this group.")]
    NotAMember,
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("The payment amount is incorrect.")]
    IncorrectAmount,
    #[msg("You have not accepted the group invitation.")]
    NotAccepted,
}

