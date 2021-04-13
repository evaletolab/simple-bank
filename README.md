❤😈🎵

# Un exercice pour créer une banque et un shitcoin, le 🧀 xCH<sub>eese</sub>
[![Build Status](https://travis-ci.com/evaletolab/simple-bank.svg?branch=master)](https://travis-ci.com/evaletolab/simple-bank)

Pour réaliser cette expérience, il faut suivre les contraintes suivantes: **(1)sans régulation bancaire**, **(2) un jeux à [somme nulle](https://fr.wikipedia.org/wiki/Jeu_%C3%A0_somme_nulle)**, **(3)incitation financière évidente**, **(4) anonyme**, **(5) 100% auditable**

## L'idée
Voici une idée de projet pour motiver la consommation locale avec l’aide d’une subvention 100 % financée.
Le principe en quelques mots. Il s’agit de créer une banque qui peut émettre des xCH🧀 dont la valeur est de 1:1 avec le CHF. Ces xCH🧀 pourront être utilisés dans tous les commerces physiques ou numériques de Suisse sans discrimination (à la seule condition qu’il faut un smartphone pour les utiliser). L’émission de xCH🧀 est toujours égale à la quantité de CHF disponibles dans la banque de sorte que 1 xCH🧀 égale bien 1 CHF.
Pour avoir des CHF numériques (xCH🧀) on peut soit en recevoir soit en acheter. L’option d’achat est disponible à la condition suivante.

## Le compte épargne
Pour produire des xCH🧀 il faut s'assurer qu'un montant équivant est déposé en CHF (ou équivalant). Pour cette raison, nous avons créé un compte d’épargne avec un taux d'intérêt incitatif d'au moins 3% par année. Le but ici est de fournir une source de subvention pour la création des xCH🧀

* Les utilisateurs sont invités à faire un dépôt épargne avec un taux d'intérêts incitatifs d'au moins 3% par année (payée en xCH🧀).
* Pour chaque achat de 100 xCH🧀 numérique, une dette 20 CHF est contractée sur les comptes épargnes.
* En contrepartie, pour chaque transaction, une taxe de 0.3% est automatiquement prélevée et distribuée à la banque à destination des comptes d'épargne.

## L’achat de xCH🧀
Pour acheter des xCH🧀 il faut assez de liquidité dans la banque. Si ce n'est pas le cas, l'achat est indisponible. Si c'est le cas, un montant de 100 xCH coûte seulement 80 chf pour le consommateur. Ce sont les dépôts d'épargne qui financent la dette de 20 chf. En contrepartie, pour chaque mouvement de xCH🧀 , une taxe de 0.3% est automatiquement prélevée et distribuée à la banque à destination des comptes d'épargne. Ce qui permet de satisfaire la règle du «jeu à somme nulle» de l’énoncé. Dans la réalité, la liquidité de xCH🧀 ne peut pas être utilisée pour produire de nouveaux xCHF🧀.

# En résumer
1. Pour chaque achat de 100 CHF numérique, l'utilisateur doit participe de 80 CHF.
2. L'achat est disponible seulement si l'épargne cumulée est suffisante.
3. Pour chaque transaction de xCH (dans un commerce Suisse) une taxe de 0.3% plus 3 centimes est prélevée. 
4. Des épargnants placent de l'argent ([ETH](https://coinmarketcap.com/fr/currencies/ethereum/), ou autres équivalants) das notre banque sur un compte épargne.
5. Cet argent est bloqué pour au minimum N mois (le retrait de l'argent dépend de la liquidité disponible moins la liquidité bloquée en dettes).
6. Dans chaque compte épargne, un intérêt annuel de minimum 3%  est produit en xCH 🧀.
7. La valeur précise du % est un calcul sur le montant total collecté par la somme des transactions dans une période de temps fixe.
8. L'intérêt est annuel, mais son actualisation est à la seconde.
9. Les paramêtres de la banque (vélocité, taux d'intérêt, dette, etc.) sont définis par le vote.
10. Les épargnants peuvent de modifier par le vote les paramêtres techniques de la banque.

## Exemple,
1. Pour 100'000 CHF d'épargne, on peut offrir 500'000 chf de crédit
2. Cycle de vie d'une unité de 100 chf, 
   1. il faut ~550 mouvements de 100 chf pour être consommé complètement (<1 chf) par les 0.3% + 3 centimes.
   2. il faut ~77 mouvements de 100 chf pour rembourser complètement la dette.
   3. il faut ~87 mouvements de 100 chf pour rembourser et produire 3% sur le compte épargne.
3. La durée de vie d'une unité de 100 chf, c'est le nombre de [transactions nécessaires](https://www.wolframalpha.com/input/?i=solve+1+%3D+100+*%281+-+0.3%25%29%5Ex+-+x*0.03) pour produire un minimum de 3% d'intérêt sur 12 mois (~87).
4. On peut **déterminer un taux d'intérêt** sur le compte épargne **en fonction** de la vélocité de l'argent (calculée sur 12 mois). Il faut un volume de liquidité minimum pour garantir une vélocité relativement stable.

> Note: cycle de vie d'une unité de 100 chf
> 
> `f(tx) = 100 *(1 - 0.3%)^tx - tx*0.03` 

## Limitations
* Ce projet est une expérience ludique & éducative.
* Il manque **toutes** les bonnes pratiques de sérurité 
* Il manque **toutes** les bonnes pratiques de programmation (migration, settings, ...) [TODO].
* Les paramètres de la banque sont hardcodés (pas de vote) [TODO]
* La conversion ETH/CHF est fixée à 1:2000 (il faudrait intégrer un [oracle](https://data.chain.link/chf-usd) chf/usd/dai) [TODO].
* Les valeurs initiales (vélocité, taxe de 0.3% + 0.3chf et intérêt de 3%) sont arbitraires [TODO].
* On ne doit pas pouvoir réinjecter en épargne les xCH 🧀 achetés par la dette.



## Math
L'équilibre entre la dette, les retraits et le capital disponible, s'inspire de cette fonction
![image](https://user-images.githubusercontent.com/1422935/114516537-c9f2c200-9c3d-11eb-91b9-e57ff2abb96a.png )
* https://blockgeeks.com/guides/makerdao-stablecoin-blockgeeks-part-2/



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
