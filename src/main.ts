import {Block, Blockchain, Transaction} from './block'
const chain = new Blockchain(4)
for (let i = 0; i < 10; i++) {
  const block = chain.addBlock(new Block([
    new Transaction('a', 'b', 100)
  ]))
  console.log(block)
  console.log('a.balance =', chain.getBalance('a'))
  console.log('b.balance =', chain.getBalance('b'))
}
