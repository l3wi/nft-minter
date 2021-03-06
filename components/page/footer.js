import { Box, Flex, HStack, Link, Text } from "@chakra-ui/layout"
import React from "react"

const links = [
  {
    label: "contracts",
    href: "https://github.com/ourzora/nft-editions",
    isExternal: true
  },
  {
    label: "lewi",
    href: "https://twitter.com/lewifree",
    isExternal: true
  }
]

const Footer = () => {
  return (
    <Box as="footer">
      <Flex
        py={8}
        flexDirection={["column", "column", "row"]}
        justifyContent="space-between"
        alignItems="center"
        as="footer"
      >
        <Box textAlign={["center", "center", "initial"]}>
          <Text fontWeight="bold" fontSize="md">
            minter.projects.sh
          </Text>
          <Text fontSize="sm" color="gray.500">
            {`Simple app for ZORA's NFT Editions`}
          </Text>
        </Box>
        <Box>
          <HStack spacing={4}>
            {links.map(({ href, isExternal, label }) => (
              <Link
                py={1}
                key={label}
                href={href}
                fontSize="sm"
                isExternal={isExternal}
                rel="noopener noreferrer"
                _hover={{
                  color: "green.300",
                  borderBottomColor: "green.300",
                  borderBottomWidth: 1
                }}
              >
                {label}
              </Link>
            ))}
          </HStack>
        </Box>
      </Flex>
    </Box>
  )
}

export default Footer
