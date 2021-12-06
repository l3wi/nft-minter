import React, { useEffect, useState } from 'react'
import {
  chakra,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stat,
  StatGroup,
  StatNumber,
  StatLabel,
  Textarea
} from '@chakra-ui/react'
import Link from 'next/link'
import { Box, Heading, Text, Center } from '@chakra-ui/layout'
import { Alert, AlertIcon } from '@chakra-ui/alert'
import { Button, IconButton } from '@chakra-ui/button'
import { useColorModeValue } from '@chakra-ui/color-mode'
import { useWeb3 } from '../../contexts/useWeb3'
import {
  fetchCollectionAtAddress,
  setEditionSalesPrice,
  mintBulkEditions,
  withdrawMintFunds
} from '../../utils/zora'
import { ethers, utils } from 'ethers'

import { useRouter } from 'next/router'

import Head from 'next/head'
import Page from '../../components/page'
import Card from '../../components/card'
import ManageHero from '../../components/manage'

function isValidPrice(price) {
  try {
    utils.parseEther(price)
  } catch {
    return false
  }
  return true
}

function getAddressListCount(addressesList) {
  return addressesList
    .split('\n')
    .map((addr) => ethers.utils.isAddress(addr))
    .reduce((last, now) => {
      if (now) {
        return last + 1
      }
      return last
    }, 0)
}

export default function Manage() {
  const router = useRouter()
  const [price, setPrice] = useState()
  const { web3, connectWallet, disconnectWallet, account, balance } = useWeb3()
  const [collection, setCollection] = useState()

  const [addressesMintBulk, setAddressesMintBulk] = useState('')
  const addressListCount = getAddressListCount(addressesMintBulk)
  const addressBulkInvalid =
    addressesMintBulk === 0 ||
    addressListCount < addressesMintBulk.split('\n').length

  useEffect(async () => {
    if (router.isReady) {
      const data = await fetchCollectionAtAddress(router.query.address)
      setCollection(data)
    }
  }, [router.isReady])

  const cardBgColor = useColorModeValue('white', 'gray.700')

  const setSalesPrice = async () => {
    const etherPrice = ethers.utils.parseEther(price)
    await setEditionSalesPrice(collection.address, etherPrice)
  }

  const stopSale = async () => {
    await setEditionSalesPrice(collection.address, '0')
  }

  const mintBulk = async () => {
    await mintBulkEditions(collection.address, addressesMintBulk.split('\n'))
  }

  const withdraw = async () => {
    await withdrawMintFunds(collection.address)
  }

  const isOwner = collection?.owner === account

  return (
    <Page>
      <Head>
        <title>{collection ? collection.name : 'NFT Printer'}</title>
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
          <Box>
            <chakra.p
              mb={2}
              fontSize="xs"
              fontWeight="semibold"
              letterSpacing="wide"
              color="gray.400"
              textTransform="uppercase"
            >
              Managers welcome
            </chakra.p>
            <chakra.h1
              mb={3}
              fontSize={{ base: '3xl', md: '4xl' }}
              fontWeight="bold"
              lineHeight="shorter"
              color={useColorModeValue('gray.900', 'white')}
            >
              Manage your Edition NFTs
            </chakra.h1>
            <chakra.p mb={5} color="gray.500" fontSize={{ md: 'lg' }}>
              Sell your own editions for a fixed price of Ether with Zora.{' '}
              <br /> Mint your edition directly to wallets.
            </chakra.p>
          </Box>

          <Flex flexDirection="column" w="800px">
            <StatGroup my={6}>
              <Stat>
                <StatLabel>Number minted</StatLabel>
                <StatNumber>{collection?.numberMinted.toString()}</StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Number of editions</StatLabel>
                <StatNumber>{collection?.editionSize.toString()}</StatNumber>
              </Stat>

              <Stat>
                <StatLabel>Unclaimed sales funds</StatLabel>
                <StatNumber>
                  {collection?.balance
                    ? ethers.utils.formatEther(collection?.balance)
                    : '???'}{' '}
                  ETH
                </StatNumber>
              </Stat>
            </StatGroup>

            {isOwner ? (
              <Heading size="md" mt="4">
                You control the {collection?.name} NFT.
              </Heading>
            ) : (
              <Alert status="warning">
                <AlertIcon />
                Only owners can manage sales and mint edition nfts.
              </Alert>
            )}

            <Flex
              sx={{ opacity: isOwner ? 1 : '0.1' }}
              flexDirection="column"
              alignItems="flex-start"
            >
              <Box
                mt="5"
                bg={cardBgColor}
                shadow="xl"
                borderRadius="2xl"
                p={8}
                w="100%"
              >
                <Heading size="md" mb="2">
                  Pricing information
                </Heading>
                {collection?.salePrice && collection.salePrice !== '0' ? (
                  <React.Fragment>
                    <Text mt="2" color="gray.600">
                      This edition is currently on sale for{' '}
                      {ethers.utils.formatEther(collection?.salePrice)} eth
                    </Text>
                    <Flex mt="3" justifyContent="space-between">
                      <Button
                        isDisabled={price === '0'}
                        onClick={() => stopSale()}
                        colorScheme="red"
                      >
                        Stop sale
                      </Button>
                    </Flex>
                  </React.Fragment>
                ) : (
                  <>
                    <Text mt="2" color="gray.600">
                      This edition is currently not for sale.
                    </Text>
                    <Text mt="2" color="gray.600">
                      To put this edition on sale, please specify a sales price.
                    </Text>
                  </>
                )}
                <Text mt="8" color="gray.600">
                  Set sales price:
                </Text>
                <FormControl
                  id="amount"
                  my={2}
                  onChange={(e) => setPrice(e.target.value)}
                >
                  <FormLabel>Amount in ether:</FormLabel>
                  <Input
                    placeholder="eg. 0.1"
                    isRequired={true}
                    type="text"
                    value={price}
                  />
                </FormControl>
                <Flex mt="3" justifyContent="space-between">
                  <Button
                    isDisabled={price === undefined || !isValidPrice(price)}
                    onClick={() => setSalesPrice()}
                    colorScheme="green"
                  >
                    Set sales price
                  </Button>
                </Flex>
              </Box>

              <Box
                mt="5"
                w="100%"
                bg={cardBgColor}
                shadow="xl"
                borderRadius="2xl"
                p={8}
              >
                <Heading size="md" mb="2">
                  Directly mint NFTs
                </Heading>
                <FormControl
                  id="amount"
                  my={2}
                  onChange={(e) => setAddressesMintBulk(e.target.value)}
                >
                  <FormLabel>Address(es) to mint to:</FormLabel>
                  <Textarea
                    placeholder="0x9444390c01Dd5b7249E53FAc31290F7dFF53450D"
                    size="md"
                    resize="horizontal"
                    isInvalid={addressBulkInvalid}
                    value={addressesMintBulk}
                  />
                </FormControl>
                <Text>Received {addressListCount} addresses to mint to:</Text>
                <Flex mt="3" justifyContent="space-between">
                  <Button
                    isDisabled={addressBulkInvalid}
                    onClick={() => mintBulk()}
                    colorScheme="green"
                  >
                    Mint to {addressListCount} wallet
                    {addressListCount === 1 ? '' : 's'}
                  </Button>
                </Flex>
              </Box>

              <Box
                mt="5"
                w="100%"
                bg={cardBgColor}
                shadow="xl"
                borderRadius="2xl"
                p={8}
              >
                <Heading size="md" mb="2">
                  Withdraw your funds
                </Heading>
                <Text>
                  Received{' '}
                  {collection?.balance
                    ? ethers.utils.formatEther(collection?.balance)
                    : '???'}{' '}
                  eth unclaimed from sales
                </Text>
                <Flex mt="3" justifyContent="space-between">
                  <Button
                    isDisabled={collection?.balance.toString() === '0'}
                    onClick={() => withdraw()}
                    colorScheme="green"
                  >
                    Withdraw your funds
                  </Button>
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Center>
    </Page>
  )
}
