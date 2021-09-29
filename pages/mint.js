import React, { useEffect, useState } from "react"
import {
  Grid,
  Divider,
  Flex,
  Box,
  Heading,
  Text,
  Center,
  Image,
  Input,
  Textarea,
  CloseButton,
  Button,
  Link
} from "@chakra-ui/react"
import { ExternalLinkIcon } from "@chakra-ui/icons"
import { useColorModeValue } from "@chakra-ui/color-mode"
import { useWeb3 } from "../contexts/useWeb3"
import { mintEdition } from "../utils/zora"
import sha256 from "crypto-js/sha256"

import { useAlerts } from "../contexts/useAlerts"
import { useRouter } from "next/router"
import { useDropzone } from "react-dropzone"
import { bytesToSize } from "../utils/helpers"

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEYyODEzMDVkN0YzOTU1ODJkMDNGNGMzOUZhODg5ODZjNzZGMTRDMTIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzMTgzMzg2Njg4NSwibmFtZSI6Ikxld2lzIn0._s5gV6xaMSinAfqQWfqqkJwX_InW8v_g21ozomLf8D4"

import Head from "next/head"
import Page from "../components/page"

export default function Home() {
  const router = useRouter()
  const { addAlert, watchTx } = useAlerts()
  const [files, setFiles] = useState([])
  const { acceptedFiles, getRootProps, fileRejections, getInputProps } =
    useDropzone({
      accept: "image/*",
      maxFiles: 1,
      onDrop: (acceptedFiles) => {
        setFiles(
          acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file)
            })
          )
        )
      }
    })
  const cardBgColor = useColorModeValue("white", "gray.700")

  const [name, setName] = useState("")
  const [symbol, setSymbol] = useState("")
  const [desc, setDesc] = useState("")
  const [edition, setEdition] = useState("")
  const [royalty, setRoyalty] = useState("")
  const [uploading, setUploading] = useState(false)
  const [fileHash, setFileHash] = useState(false)

  useEffect(() => {
    if (fileRejections[0]) {
      addAlert(
        "fail",
        fileRejections[fileRejections.length - 1].errors[0].message
      )
    }
  }, [fileRejections])

  useEffect(async () => {
    if (acceptedFiles[0]) {
      console.log(acceptedFiles[acceptedFiles.length - 1])
      setUploading(true)

      var data = new FormData()
      data.append("file", acceptedFiles[acceptedFiles.length - 1])

      const image = await fetch("https://api.nft.storage/upload", {
        method: "POST",
        headers: new Headers({ Authorization: `Bearer ${token}` }),
        body: data
      }).then((res) => res.json())
      console.log(image)
      //   const image = await client.storeBlob(
      //     acceptedFiles[acceptedFiles.length - 1]
      //   )
      setFileHash(image.value.cid)
      setUploading(false)
      console.log(image)
    }
  }, [acceptedFiles])

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview))
    },
    [files]
  )

  const validateInfo = () => {
    if (name === "") return true
    return false
  }

  const mint = async () => {
    const animURL = ""
    const animHash =
      "0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" // Null Hash
    const imgURL = "ipfs://" + fileHash
    const imgHash =
      "0x" + sha256(acceptedFiles[acceptedFiles.length - 1]).toString()

    const response = await mintEdition({
      name,
      symbol,
      desc,
      animURL,
      animHash,
      imgURL,
      imgHash,
      edition,
      royalty
    })
    watchTx(response.hash, "Minting Editions").then((data) => router.push("/"))
  }

  return (
    <Page>
      <Head>
        <title>Mint an Editon - Minter</title>
        <link rel="icon" href="/herb.png" />
      </Head>

      <Flex
        flexDirection="column"
        w="100%"
        maxW={{ base: "100%", md: 800 }}
        mt={{ base: 10, md: 20 }}
        alignItems="flex-start"
      >
        <Heading size="lg" color="gray.700">
          Mint a new edition
        </Heading>
        <Text mt="2" color="gray.600">
          Fill out the details below to configure a new edition. These details
          will then be used to create a new contract specifically for your NFTs.
          These can then be minted directly by you or this app can be used to
          provide a minting interface for your friends!
        </Text>

        <Box
          mt="5"
          w="100%"
          bg={cardBgColor}
          shadow="xl"
          borderRadius="2xl"
          p={8}
        >
          <Heading size="md" mb="2">
            Information
          </Heading>
          <Text>Name:</Text>
          <Input
            placeholder="eg. Tanzanian Turtles"
            value={name}
            // isInvalid={name === ""}
            onChange={(e) => setName(e.target.value)}
          />
          <Text>Symbol:</Text>
          <Input
            placeholder="eg. TURTL"
            value={symbol}
            // isInvalid={symbol === ""}
            onChange={(e) => setSymbol(e.target.value)}
          />
          <Text>Description:</Text>
          <Textarea
            placeholder="eg. Tanzanian Turtles is your ticket to the...."
            value={desc}
            // isInvalid={desc === ""}
            onChange={(e) => setDesc(e.target.value)}
          />
          <Text>Edition Size:</Text>
          <Input
            placeholder="eg. 100"
            value={edition}
            onChange={(e) => setEdition(e.target.value)}
          />
          <Text>Sale Royalty (BPS):</Text>
          <Input
            placeholder="eg. 50"
            value={royalty}
            onChange={(e) => setRoyalty(e.target.value)}
          />
        </Box>
        <Box
          mt="5"
          w="100%"
          bg={cardBgColor}
          shadow="xl"
          borderRadius="2xl"
          p={8}
        >
          <Flex alignItems="center" justifyContent="space-between" mb="2">
            <Heading size="md">Media</Heading>
            {uploading || fileHash ? (
              <CloseButton onClick={() => setFileHash(false)} />
            ) : null}
          </Flex>
          {uploading || fileHash ? (
            <Flex w="full" justifyContent="space-between">
              <Box>
                <Text>
                  <b>File:</b> {files[acceptedFiles.length - 1].path}{" "}
                </Text>
                <Text>
                  <b>Size:</b>{" "}
                  {bytesToSize(files[acceptedFiles.length - 1].size)}
                </Text>
                <Text>
                  <b>Status:</b>{" "}
                  {uploading ? (
                    "Uploading..."
                  ) : (
                    <Link
                      href={`https://${fileHash}.ipfs.dweb.link/`}
                      isExternal
                    >
                      Uploaded <ExternalLinkIcon mx="2px" />
                    </Link>
                  )}{" "}
                </Text>{" "}
              </Box>
              <Image src={files[acceptedFiles.length - 1].preview} maxW={350} />
            </Flex>
          ) : (
            <Box
              as={"div"}
              w="100%"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "60px 20px",
                borderWidth: 2,
                borderRadius: 2,
                borderColor: "#eeeeee",
                borderStyle: "dashed",
                backgroundColor: "#fafafa",
                color: "#bdbdbd",
                outline: "none",
                transition: "border .24s ease-in-out"
              }}
              {...getRootProps({ className: "dropzone" })}
            >
              <input {...getInputProps()} />
              <p>{`Drag 'n' drop a file here, or click to select a file`}</p>
            </Box>
          )}
        </Box>
        <Flex mt="3" justifyContent="space-between">
          <Button
            isDisabled={validateInfo()}
            onClick={() => mint()}
            colorScheme="green"
          >
            Mint NFT Edition
          </Button>
        </Flex>
      </Flex>
    </Page>
  )
}
