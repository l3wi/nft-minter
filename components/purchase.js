import { Flex, Box, chakra, HStack, Button } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/color-mode'
import { useRouter } from 'next/router'
const PurchaseHero = ({}) => {
  const router = useRouter()
  return (
    <Box w={{ base: '3xl' }}>
      <chakra.p
        mb={2}
        fontSize="xs"
        fontWeight="semibold"
        letterSpacing="wide"
        color="gray.400"
        textTransform="uppercase"
      >
        Collectors welcome
      </chakra.p>
      <chakra.h1
        mb={3}
        fontSize={{ base: '3xl', md: '4xl' }}
        fontWeight="bold"
        lineHeight="shorter"
        color={useColorModeValue('gray.900', 'white')}
      >
        Purchase Edition NFTs
      </chakra.h1>
    </Box>
  )
}
export default PurchaseHero
