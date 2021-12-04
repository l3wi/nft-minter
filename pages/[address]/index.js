import Card from '../../components/card'
import useWeb3 from '../../contexts/useWeb3'
import {
  Flex,
  Box,
  Stat,
  StatNumber,
  Image,
  Center,
  Button,
  StatGroup,
  StatLabel,
  chakra
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Page from '../../components/page'
import { fetchCollectionAtAddress } from '../../utils/zora'
import { ethers } from 'ethers'

import { useNFTIndexerQuery, NFTFetchConfiguration } from '@zoralabs/nft-hooks'
import { normalizeIpfsHash } from '../../utils/helpers'

import { chainID } from '../../utils/ethers'
import { purchaseEdition } from '../../utils/zora'

const Purchase = () => {
  const { account, networkId } = useWeb3()
  const router = useRouter()
  const [collection, setCollection] = useState()
  const [isOwner, setOwner] = useState(false)

  useEffect(async () => {
    if (router.isReady && account) {
      const data = await fetchCollectionAtAddress(router.query.address)
      setCollection(data)
      setOwner(data.owner === account)
    }
  }, [router.isReady, account])

  const purchase = async () => {
    await purchaseEdition(collection?.address, collection?.salePrice)
  }
  const manage = async () => {
    router.push(`/${router.query.address}/manage`)
  }

  return (
    <Page>
      <Head>
        <title>NFT Minter</title>
        <link rel="icon" href="/herb.png" />
      </Head>
      <Center>
        <Flex
          flexDirection="column"
          w="100%"
          maxW={{ base: '100%', md: 1440 }}
          mt={4}
          alignItems="flex-start"
        >
          <Flex flexDirection="column" w="100%">
            <Box w={{ base: '3xl' }}>
              <chakra.p
                mb={2}
                fontSize="xs"
                fontWeight="semibold"
                letterSpacing="wide"
                color="gray.400"
                textTransform="uppercase"
              >
                {`$${collection?.symbol}`}
              </chakra.p>
              <chakra.h1
                mb={3}
                fontSize={{ base: '3xl', md: '4xl' }}
                fontWeight="bold"
                lineHeight="shorter"
              >
                {`${collection?.name}`}
              </chakra.h1>
            </Box>

            <Flex
              flexDirection={{ base: 'column', md: 'row' }}
              justifyContent="space-between"
            >
              <Flex flexDirection="column" justifyContent="space-between">
                <chakra.p
                  maxW="600"
                  color="gray.500"
                  fontSize={{ md: 'lg' }}
                  mr="4"
                >
                  {`roin ac eleifend sem. Curabitur magna elit, malesuada mollis mi a, molestie aliquam sapien. 
                Quisque eu mi non sem euismod egestas. Vestibulum tempor, magna non luctus lacinia, nunc dolor
                mattis dolor, et maximus lorem augue sed enim. Nullam tincidunt egestas felis, non pharetra 
                purus sagittis sit amet.`}
                </chakra.p>

                <Box>
                  <StatGroup my={3}>
                    <Stat>
                      <StatLabel>Number minted</StatLabel>
                      <StatNumber>
                        #{collection?.numberMinted.toString()}
                      </StatNumber>
                    </Stat>

                    <Stat>
                      <StatLabel>Editions</StatLabel>
                      <StatNumber>
                        #{collection?.editionSize.toString()}
                      </StatNumber>
                    </Stat>

                    <Stat>
                      <StatLabel>Sale price</StatLabel>
                      <StatNumber>
                        {collection?.salePrice &&
                        collection?.salePrice.toString() !== '0'
                          ? ethers.utils.formatEther(collection?.salePrice)
                          : 'Not for sale'}{' '}
                        ETH
                      </StatNumber>
                    </Stat>
                  </StatGroup>
                  <Flex my={3}>
                    <Button onClick={() => purchase()} colorScheme="green">
                      Purchase an Edition
                    </Button>
                    {isOwner && (
                      <Button
                        ml="4"
                        onClick={() => manage()}
                        colorScheme="pink"
                      >
                        Manage NFT
                      </Button>
                    )}
                  </Flex>
                </Box>
              </Flex>
              <Box>
                <Image
                  alt="Project image"
                  maxW="600"
                  maxH="600"
                  src={
                    collection
                      ? normalizeIpfsHash(collection.URIs[0])
                      : '/loading.png'
                  }
                  rounded="lg"
                />
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Center>
    </Page>
  )
}

export default Purchase
