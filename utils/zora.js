import { ethers, utils } from "ethers"
import { Contract, Provider } from "ethers-multicall"
import { zoraMinter, zoraNFT } from "../contracts"
import { web3, chainID } from "./ethers"

export const fetchCollections = async () => {
  const minter = new ethers.Contract(zoraMinter[chainID], zoraMinter.abi, web3)
  const filter = minter.filters.CreatedEdition()
  const ids = await minter.queryFilter(filter)
  console.log(ids)
  const collections = await Promise.all(
    ids.map((item) => fetchCollection(item.args.editionId.toString()))
  )
  return collections
}

export const fetchCollection = async (id) => {
  const minter = new ethers.Contract(zoraMinter[chainID], zoraMinter.abi, web3)
  const address = await minter.getEditionAtId(id)

  const ethcallProvider = new Provider(web3)
  await ethcallProvider.init()
  const nftContract = new Contract(address, zoraNFT.abi)

  const calls = [
    nftContract.name(),
    nftContract.symbol(),
    nftContract.owner(),
    nftContract.salePrice(),
    nftContract.editionSize(),
    nftContract.getURIs()
  ]
  const [name, symbol, owner, salePrice, editionSize, URIs] =
    await ethcallProvider.all(calls)

  return {
    name,
    symbol,
    owner,
    salePrice: salePrice.toString(),
    editionSize: editionSize.toString(),
    URIs
  }
}

export const mintEdition = async (data) => {
  const signer = web3.getSigner()
  const minter = new ethers.Contract(
    zoraMinter[chainID],
    zoraMinter.abi,
    signer
  )
  const response = await minter.createEdition(
    data.name,
    data.symbol,
    data.desc,
    data.animURL,
    data.animHash,
    data.imgURL,
    data.imgHash,
    data.edition,
    data.royalty
  )
  return response
}
