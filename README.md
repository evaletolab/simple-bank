## L'idée
Il faut trouver un exemple qui réunis au minimum les critères suivants: **(1) régulation bancaire obligatoire**, **(2) jeux à somme nulle**, **(3) insitation financière évidente**, **(4) pseudo anonyme**

Voici une idée simple, qui mélange l'aide au commerce local, et l'investissement avec son taux d'intérêt. Son principe est simple, lorsqu'un utilisateur achête des CHF numériques, il contracte automatiquement une dette de 20% du montant (Une montant de 100 fr lui coute 80 fr). En contrepartie, pour chaque transaction, une taxe de 0.3% est automatiquement prélevée et placé à la banque. 

![image](https://user-images.githubusercontent.com/1422935/113479644-8e633580-9490-11eb-83db-07215c0ef85f.png)

1. Pour chaque achat de token 100% CHF, l'utilisateur doit payé 80 CHF.
2. Pour chaque transaction (dans un commerce local) une taxe de 0.3% est prélevée. 
3. Des investisseurs (que l'on nomme compte épargne) placent de l'argent à la banque 
4. Cet argent est bloqué pour au minimum N mois
5. Dans chaque compte épargne, un intérêt annuel supérieur à 3% est garanti 
6. la valeur précise du % est un calcul sur le montant total collecté par la somme des transactions
7. l'intérêt est annuel, mais son actualisation est à la seconde
,


## Prepare
`mkdir my-eth-project && cd my-eth-project`
`npm install --save-dev hardhat`

## git
  git clone https://github.com/evaletolab/simple-bank
  cd simple-bank
  npm i

## Metamaks
* install Metamsk extension
* create account based on mnemonic: "test test test test test test test test test test test junk"
* use localhost:8545 network with chainId **31337**

### create project

`npx hardhat`

## Wallets
`npx hardhat accounts`

## Deploy

`npx hardhat run --network localhost scripts/deploy.js`


## Tutorial

* hardhat https://www.youtube.com/watch?v=GBc3lBrXEBo
* bank (deposit, borrow) https://www.youtube.com/watch?v=xWFba_9QYmc
* bank github project https://github.com/dappuniversity/dbank
* testing contracts https://github.com/nomiclabs/hardhat/blob/0b064c8eaa58975bf84e60b1058d296fccc3d9eb/docs/tutorial/testing-contracts.md
* forked test network https://dashboard.alchemyapi.io/signup/
* https://github.com/nomiclabs/hardhat-hackathon-boilerplate/blob/6a17aeca1675649b8e2aa6d2257cb29771793a09/frontend/src/components/Dapp.js#L208
* https://github.com/Web3Modal/web3modal
* https://github.com/symfoni/hardhat-react-boilerplate
* https://docs.alchemyapi.io/alchemy/tutorials/hello-world-smart-contract
* https://github.com/EthWorks/Waffle

### Chain link
* new project https://blog.chain.link/using-chainlink-with-hardhat/
* https://blog.chain.link/fetch-current-crypto-price-data-solidity/
* use oracle chf/usd(dai) https://data.chain.link/chf-usd
