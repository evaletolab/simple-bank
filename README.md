![image](https://user-images.githubusercontent.com/1422935/113506194-9f20b380-9543-11eb-8ffe-6ed2b181896b.png)

# Une expérience économique

Pour réaliser cette expérience, il faut résoudre les problèmes suivants: **(1)sans régulation bancaire**, **(2) un jeux à [somme nulle](https://fr.wikipedia.org/wiki/Jeu_%C3%A0_somme_nulle)**, **(3)incitation financière évidente**, **(4) anonyme**, **(5) 100% auditable**

## L'idée

Voici une idée simple pour créer une banque sans licence qui mélange l'aide au commerce local et l'épargne avec un taux d'intérêt incitatif. Le principe est simple, lorsqu'un utilisateur achète des CHF numériques, il contracte automatiquement une dette de 20% du montant (Un montant de 100chf coute 80chf). En contrepartie, pour chaque transaction, une taxe de 0.3% est automatiquement prélevée et distribué à la banque pour les comptes d'épargne. 


1. Pour chaque achat de 100 CHF numérique, l'utilisateur doit payer 80 CHF.
2. Pour chaque transaction (dans un commerce local) une taxe de 0.3% plus 3 centimes est prélevée. 
3. Des investisseurs placent de l'argent ([ETH](https://coinmarketcap.com/fr/currencies/ethereum/))  à la banque sur un compte épargne.
4. Cet argent est bloqué pour au minimum N mois (le retrait de l'argent est une fonction à somme nulle, ce qui implique une limite).
5. Dans chaque compte épargne, un intérêt annuel supérieur à 3% devrait être obtenu.
6. La valeur précise du % est un calcul sur le montant total collecté par la somme des transactions.
7. L'intérêt est annuel, mais son actualisation est à la seconde.
8. Les paramêtres de la banque (vélocité, taux d'intérêt, dette, etc.) sont définis par le vote.

### Exemple,
1. Pour 100'000 CHF d'épargne, on peut offrir 500'000 chf de crédit
2. Cycle de vie d'une unité de 100 chf, 
   1. il faut ~550 mouvements de 100 chf pour être consommé complètement (<1 chf) par les 0.3% + 3 centimes.
   2. il faut ~77 mouvements de 100 chf pour rembourser complètement la dette.
   3. il faut ~87 mouvements de 100 chf pour rembourser et produire 3% sur le compte épargne.
3. La durée de vie d'une unité de 100 chf, c'est le nombre de [transactions nécessaires](https://www.wolframalpha.com/input/?i=solve+100*0.997%5Ex+%3D+77) pour produire un minimum de 3% d'intérêt sur 12 mois (~87).
4. On peut déterminer un taux d'intérêt sur le compte épargne en fonction de la vélocité de l'argent (calculée sur 12 mois). Cependant, il faut une vélocité qu'une liquidité minimum pour garantir un taux minimum de incitatif pour l'épargnant.


![image](https://user-images.githubusercontent.com/1422935/113487142-96ce6700-94b6-11eb-8888-e97d6ee217b1.png)

> Note: formule utilisée pour le calcul de vie d'une unité de 100 chf
> 
> `f(tx) = 100 *(1 - 0.3%)^tx - tx*0.03` 

![image](https://user-images.githubusercontent.com/1422935/113479644-8e633580-9490-11eb-83db-07215c0ef85f.png)

## Limitations
Cette banque est seulement une expérience technologique et éducative.
* la sérurité est pas intégrée
* La conversion ETH/CHF est fictive (il manque l'utilisation d'un oracle chf/usd(dai) https://data.chain.link/chf-usd
* Les valeurs initiales (vélocité, taxe de 0.3% + 0.3chf et intérêt de 3%) sont arbitraires 

# Prepare the project
`mkdir my-eth-project && cd my-eth-project`
`npm install --save-dev hardhat`

## git

``` shell
  git clone https://github.com/evaletolab/simple-bank
  cd simple-bank
  npm i
```  

## Metamaks
* install Metamsk extension
* create account based on mnemonic: "test test test test test test test test test test test junk"
* use localhost:8545 network with chainId **31337**

### create project

`npx hardhat`

## Wallets
`npx hardhat accounts`

## Deploy

```
npx hardhat node &
npx hardhat run --network localhost scripts/deploy.js
```


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
