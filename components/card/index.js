import { Flex, Box, Image, Badge } from "@chakra-ui/react"
import { useColorModeValue } from "@chakra-ui/color-mode"

import { normalizeIpfsHash } from "../../utils/helpers"

const Card = (data) => {
  const { name, symbol, editionSize, owner, URIs } = data

  return (
    <Box
      key={name}
      bg={useColorModeValue("white", "gray.800")}
      w="fit-content"
      maxW="sm"
      borderWidth="1px"
      rounded="lg"
      shadow="lg"
    >
      <Flex w="300px" h="300px" justifyContent="center" alignItems="center">
        <Image
          maxW={300}
          maxH={300}
          src={normalizeIpfsHash(URIs[0])}
          roundedTop="lg"
        />
      </Flex>

      <Box p="6" w="fit-content">
        <Box d="flex" alignItems="baseline">
          <Badge rounded="full" px="2" colorScheme="teal">
            ${symbol}
          </Badge>
          <Box
            color="gray.500"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            EDITION OF {editionSize}
          </Box>
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
        >
          {name}
        </Box>

        <Box>
          Owner: {owner.slice(0, 8) + "..." + owner.slice(owner.length - 3, -1)}
        </Box>
      </Box>
    </Box>
  )
}

export default Card
