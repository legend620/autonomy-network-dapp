import React, { useState } from 'react'
import { Container, Button, Box, Text, Input } from '@chakra-ui/react'
import { useEthers, useEtherBalance } from '@usedapp/core'
import { AddressZero } from '@ethersproject/constants'
import { formatEther, parseEther } from '@ethersproject/units'
import { Contract } from '@ethersproject/contracts'

import EthSenderABI from '../abis/EthSender.json'
import RegistryABI from '../abis/Registry.json'
import { ETH_SENDER_ADDRESS, REGISTRY_ADDRESS } from '../config/contract'

export default function Home() {
  const { activateBrowserWallet, account, library } = useEthers()
  const etherBalance = useEtherBalance(account)
  const [userAddress, setUserAddress] = useState(null)
  const [ethAmount, setEthAmount] = useState(null)
  const [timeout, setTimeout] = useState(null)

  function handleConnectWallet() {
    activateBrowserWallet()
  }

  async function handleRequest() {
    const ethSenderContract = new Contract(
      ETH_SENDER_ADDRESS,
      EthSenderABI,
      library.getSigner(),
    )
    const callData = ethSenderContract.interface.encodeFunctionData(
      'sendEthAtTime',
      [Date.now() + parseInt(timeout) * 60, userAddress],
    )

    const registryContract = new Contract(
      REGISTRY_ADDRESS,
      RegistryABI,
      library.getSigner(),
    )
    const amount = parseFloat(ethAmount) + 0.01

    try {
      const receipt = await registryContract
        .newReq(
          ETH_SENDER_ADDRESS,
          AddressZero,
          callData,
          parseEther(amount.toString()),
          false,
          false,
          false,
          {
            gasPrice: 1000000000000,
            gasLimit: 850000,
          },
        )
        .then((tx) => tx.wait())

      console.log(receipt)
    } catch (err) {
      console.log(err)
    }
  }

  return account ? (
    <Container>
      <Box display="flex" alignItems="center" py="0" justifyContent="flex-end">
        <Box px="3">
          <Text color="white" fontSize="md">
            {etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3)}{' '}
            ETH
          </Text>
        </Box>
        <Button
          bg="gray.800"
          border="1px solid transparent"
          _hover={{
            border: '1px',
            borderStyle: 'solid',
            borderColor: 'blue.400',
            backgroundColor: 'gray.700',
          }}
          borderRadius="xl"
          m="1px"
          px={3}
          height="38px"
        >
          <Text color="white" fontSize="md" fontWeight="medium" mr="2">
            {account &&
              `${account.slice(0, 6)}...${account.slice(
                account.length - 4,
                account.length,
              )}`}
          </Text>
        </Button>
      </Box>
      <Box pt={3}>
        <Input
          variant="outlined"
          placeholder="Address"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
        />
      </Box>
      <Box pt={3}>
        <Input
          variant="outlined"
          type="number"
          placeholder="ETH"
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
        />
      </Box>
      <Box pt={3}>
        <Input
          variant="outlined"
          type="number"
          placeholder="Timeout in minutes"
          value={timeout}
          onChange={(e) => setTimeout(e.target.value)}
        />
      </Box>
      <Box pt={3}>
        <Button onClick={handleRequest}>Request</Button>
      </Box>
    </Container>
  ) : (
    <Button onClick={handleConnectWallet}>Connect to a wallet</Button>
  )
}
