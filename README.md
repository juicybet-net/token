# Vesting contract.

The purpose is to distribute tokens among given investors within given period of time by linear formula.

Contract owner sets token allocation parameters for investors. 
He sets amount of tokens each of them can claim.
He sets global vesting begin time, which can be changed until `vestingBeginIsLocked` flag is set, or vesting begin time has passed.
Each investor has personal `lockupPeriod`, during which (starting from common `vestingBegin`) the tokens he got are locked in the contract.
After investor's lockup period passes, gradual tokens unlock period starts for him, and it ends when his personal `vestingPeriod` is finished.


![image](https://user-images.githubusercontent.com/48915866/192630380-98433eff-d94b-480f-a2c2-e231a42e89da.png)

Investors can have multiple allocations with different params.
By calling `claim`, investor claims all available to claim amount of tokens from all of his allocations.
