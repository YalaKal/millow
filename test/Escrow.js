const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Escrow', () => {
    let buyer, seller, inspector, lender
    let realEstate, escrow

    beforeEach(async () => {
        // Setup accounts
        [buyer, seller, inspector, lender] =  await ethers.getSigners()

        // Deploy the Real Estate SC
        const RealEstate = await ethers.getContractFactory('RealEstate')
        realEstate = await RealEstate.deploy()

        //console.log(realEstate.address)
        // Mint
        let transaction = await realEstate
            .connect(seller)
            .mint("https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS")
        await transaction.wait()

        // Deploy the Escrow SC
        const Escrow = await ethers.getContractFactory('Escrow')
        escrow = await Escrow.deploy(
            realEstate.address,
            seller.address,
            inspector.address,
            lender.address
        )
    })

    describe('Deployment', () => {
        it('Reurns NFT address', async () => {
            const result = await escrow.nftAddress()
            expect(result).to.be.equal(realEstate.address)
        })
    
        it('Reurns Seller address', async () => {
            const result = await escrow.seller()
            expect(result).to.be.equal(seller.address)
        })
    
        it('Reurns Inspector address', async () => {
            const result = await escrow.inspector()
            expect(result).to.be.equal(inspector.address)
        })
    
        it('Reurns Lender address', async () => {
            const result = await escrow.lender()
            expect(result).to.be.equal(lender.address)
        })
    })

})
