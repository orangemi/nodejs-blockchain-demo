import * as sha256 from 'crypto-js/sha256'

export class Transaction {
  from: string
  to: string
  amount: number = 0
  constructor(from, to, amount) {
    this.from = from
    this.to = to
    this.amount = amount
  }
  toString() {
    return [this.from, this.to, this.amount].join(',')
  }
}

export class Block {
  transactions: Array<Transaction> = []
  hash: string
  prevHash: string
  timestamp: Date
  nonce: number = 0

  constructor(transactions: Array<Transaction> = [], timestamp: Date = new Date(), prevHash = '') {
    this.timestamp = timestamp
    this.transactions = transactions
    this.prevHash = prevHash
    this.hash = this.calculateHash()
  }

  calculateHash() {
    return sha256([
      this.prevHash,
      this.timestamp.getTime(),
      this.transactions.map(t => t.toString()).join(';'),
      this.nonce,
    ].join('')).toString()
  }

  mine(difficulty: number) {
    while (!this.isValid(difficulty)) {
      this.nonce++
      this.hash = this.calculateHash()
    }
  }

  isValid(difficulty: number) {
    return this.hash.substring(0, difficulty).split('').filter(d => d === '0').length === difficulty
  }
}

export class Blockchain {
  chain: Array<Block>
  difficulty: number = 4
  constructor (difficulty: number) {
    this.difficulty = difficulty
    this.chain = [this.createInitBlock()]
  }

  createInitBlock() {
    return new Block([])
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1]
  }

  addBlock(block: Block) {
    block.prevHash = this.getLastBlock().hash
    block.mine(this.difficulty)
    block.hash = block.calculateHash()
    this.chain.push(block)
    return block
  }

  getBalance(account: string) {
    let balance = 0
    this.chain.forEach(block => block.transactions.forEach(transaction => {
      if (transaction.from === account) balance -= transaction.amount
      else if (transaction.to === account) balance += transaction.amount
    }))
    return balance
  }

  isValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i]
      const prev = this.chain[i - 1]
      if (current.hash !== current.calculateHash()) return false
      if (current.prevHash !== prev.hash) return false
    }
    return true
  }
}
