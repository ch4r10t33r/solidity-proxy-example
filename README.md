# Description

Solidity program that accepts tokens from an ERC20 complaint contract and then equally distributes the tokens among its wallet members. The program also demonstrates the usage of Truffle/MochaJS test cases with Async/Await.

# Requirements:

Write a contract, with a constructor that takes 2 arguments: an address of ERC20 token and an array of address (wallets of users). The contract allows any amount of tokens to be sent to it and the amount of token send to the contract should be split equally to all addresses given in the constructor. Token can be withdrawn by users using the appropriate function.

# How to run:

git clone https://github.com/zincoshine/solidity-proxy-example.git
run testrpc
truffle compile
truffle migrate
truffle test

