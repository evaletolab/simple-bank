## L'idée
Il faut trouver un exemple qui réunis au minimum les critères suivants: **(1) régulation bancaire obligatoire**, **(2) jeux à somme nulle**, **(3) insitation financière évidente**, **(4) pseudo anonyme**, **(5) 100% auditable**

Voici une idée simple pour créer une banque sans license bancaire et qui mélange l'aide au commerce local et l'épargne avec son taux d'intérêt (que j'espère) supérieur à 3%. Son principe est simple, lorsqu'un utilisateur achête des CHF numériques, il contracte automatiquement une dette de 20% du montant (Un montant de 100 fr lui coute 80 fr). En contrepartie, pour chaque transaction, une taxe de 0.3% est automatiquement prélevée et placé à la banque. 


1. Pour chaque achat de token 100% CHF, l'utilisateur doit payé 80 CHF.
2. Pour chaque transaction (dans un commerce local) une taxe de 0.3% est prélevée. 
3. Des investisseurs (que l'on nomme compte épargne) placent de l'argent à la banque 
4. Cet argent est bloqué pour au minimum N mois
5. Dans chaque compte épargne, un intérêt annuel supérieur à 3% est garanti 
6. la valeur précise du % est un calcul sur le montant total collecté par la somme des transactions
7. l'intérêt est annuel, mais son actualisation est à la seconde

### Exemple,
1. Pour 100'000 CHF d'épargne, on peut offrir 500'000 chf de crédit
2. Pour une unité de 100 chf, 
  * il faut 333 mouvements de 100 chf pour être consommé complètement par les 0.3%.
  * il faut 66 mouvements de 100 chf pour rembourser complètement la dette.
  * il faut 76 mouvements de 100 chf pour rembourser et produire 3% sur le compte épargne.
3. La durée de vie d'une unité de 100 chf, c'est le nombre de [transactions nécessaires](https://www.wolframalpha.com/input/?i=solve+100*0.997%5Ex+%3D+77) qu'elle doit effectuée pour produire le minimum de 3% d'intérêt sur 12 mois (~85).
3. On peut déterminer un taux d'intérêt sur le compte épargne, en fonction de la vélocité de l'argent (calculée sur 12 mois). Il y a un seuil de X mouvements qui détermine un taux est au minimum de 3%.

> Note: la formule utilisée pour le calcul de vie d'une unité de 100 chf, est celle de l'intérêt composé 
> 
> `f(year) = 100 *(1 - 0.3%)^year` 
> 
> Et son inverse,
> => https://www.wolframalpha.com/input/?i=solve+100*0.997%5Ex+%3D+1 

![image](https://user-images.githubusercontent.com/1422935/113479644-8e633580-9490-11eb-83db-07215c0ef85f.png)

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
